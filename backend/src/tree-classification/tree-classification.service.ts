import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { TreeClassificationDto } from './dto/tree-classification.dto';
import { TreeClassification, TreeClassificationDocument } from './dto/tree-classification.schema';

@Injectable()
export class TreeClassificationService {

    constructor(
        @InjectModel(TreeClassification.name) private TreeClassificationModel: Model<TreeClassificationDocument>,
        private transaction: TransactionHelper,
        private redisCacheService: RedisCacheService,
    ) { };
    TREE_CACHE_KEY: String = "tree_";

    async deleteById(id: string): Promise<any> {
        const data = await this.TreeClassificationModel.findById(id);
        this.clearCache(data.dataClass);
        const session = await this.transaction.startTransactionAuto();
        const deleteData = () => new Promise<TreeClassification>((res, rej) => {
            session.withTransaction(async () => {
                await this.TreeClassificationModel.updateMany(
                    { parent: data.parent, sort: { $gt: data.sort }, dataClass: data.dataClass },
                    { $inc: { sort: - 1 } },
                    { session });
                await this.TreeClassificationModel.updateMany(
                    { parent: data.parent, dataClass: data.dataClass },
                    { $inc: { breathCount: - 1 } },
                    { session });
                res(await this.TreeClassificationModel.findByIdAndDelete(id, { session }))
            }).catch(err => {
                console.log(err);
                rej(err)
            });
        });
        return await deleteData();
    }
    async create(treeClassification: TreeClassification): Promise<TreeClassification> {
        treeClassification.addDate = new Date();
        treeClassification.UUID = randomUUID().replace(/-/g, "");
        await this.clearCache(treeClassification.dataClass);
        const session = await this.transaction.startTransactionAuto();
        const createData = () => new Promise<TreeClassification>((res, rej) => {
            session.withTransaction(async () => {
                await this.TreeClassificationModel.updateMany({ parent: treeClassification.parent, UUID: { $ne: treeClassification.UUID } }, { breathCount: treeClassification.breathCount }, { session });
                res(await new this.TreeClassificationModel(treeClassification).save({ session }))
            }).catch(err => {
                console.log(err);
                rej(err)
            });
        });
        return await createData();
    }
    async update(treeClassification: TreeClassification, id: string, req: any): Promise<any> {
        treeClassification.updateUser = req?.user?.userName;
        treeClassification.updateDate = new Date();
        delete treeClassification.addDate;
        delete treeClassification.addUser;
        await this.clearCache(treeClassification.dataClass);
        return await this.TreeClassificationModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...treeClassification } });
    }
    async getLastList(dataClass: string, parent?: string): Promise<any[]> {
        if (parent) {
            return await this.TreeClassificationModel.aggregate([
                {
                    $graphLookup: {
                        from: 'treeclassifications',
                        startWith: '$UUID',
                        connectFromField: 'UUID',
                        connectToField: 'parent',
                        maxDepth: 100,
                        as: 'descendants'
                    }
                },
                {
                    $match: {
                        descendants: { $size: 0 },
                        parent,
                        dataClass,
                    }
                }
            ])
        } else {
            return await this.TreeClassificationModel.aggregate([
                {
                    $graphLookup: {
                        from: 'treeclassifications',
                        startWith: '$UUID',
                        connectFromField: 'UUID',
                        connectToField: 'parent',
                        maxDepth: 100,
                        as: 'descendants'
                    }
                },
                {
                    $match: {
                        descendants: { $size: 0 },
                        parent: { $ne: 0 },
                        dataClass,
                    }
                }
            ])
        }

    }
    async getFirstList(dataClass: string): Promise<TreeClassification[]> {
        return await this.TreeClassificationModel.find({
            $or: [
                { parent: "0" },
                { parent: undefined },
                { parent: null }
            ],
            dataClass
        }).sort({ sort: 1 });
    }
    getCacheKey(dataClass: String, isOpen?: boolean): string {
        let cacheKey = `${this.TREE_CACHE_KEY}${dataClass}`;
        if (isOpen) {
            cacheKey = `${this.TREE_CACHE_KEY}${dataClass}Open`;
        }
        return cacheKey;
    }
    async getByCache(dataClass: String, isOpen?: boolean): Promise<any> {
        return await this.redisCacheService.get(this.getCacheKey(dataClass, isOpen));
    }
    async clearCache(dataClass: String) {
        await this.redisCacheService.del(this.getCacheKey(dataClass, false));
        await this.redisCacheService.del(this.getCacheKey(dataClass, true));
    }
    async setCache(dataClass: String, data: String, isOpen?: boolean) {
        await this.redisCacheService.set(this.getCacheKey(dataClass, isOpen), data, 60 * 60);
    }
    /**
     * 
     * @param dataClass 
     * @param keyWord 
     * @param isOpen true:获取所有启用的数据；为空则获取所有数据
     * @returns 
     */
    async getTree(dataClass: String, keyWord: String, isOpen?: boolean): Promise<TreeClassificationDto[]> {
        let tree: any = null;
        if (!keyWord) {
            tree = await this.getByCache(dataClass, isOpen)
        }
        if (!tree) {
            tree = [];
            let map: any = {
                dataClass
            };
            if (keyWord) {
                map.$or = [
                    { name: { $regex: `${keyWord}` } }
                ]
            }
            if (isOpen) {
                map.isOpen = true;
            }
            const list = await this.TreeClassificationModel.find(map).sort({ sort: 1 });
            const top = list.filter(i => !i.parent || i.parent == "0");
            let tempList = list.filter(i => i.parent || i.parent != "0")
            if (top.length > 0) {
                const getChild = (parent: String): TreeClassificationDto[] => {
                    const childList = tempList.filter(i => i.parent == parent);
                    tempList = tempList.filter(i => i.parent != parent);
                    const childArr: TreeClassificationDto[] = []
                    for (const key in childList) {
                        const childItem = new TreeClassificationDto(childList[key]);
                        childItem.children = getChild(childItem.UUID);
                        childArr.push(childItem);
                    }
                    return childArr;
                }
                for (const key in top) {
                    const item = new TreeClassificationDto(top[key]);
                    item.children = getChild(top[key].UUID);
                    tree.push(item)
                }
            }
            if (top.length > 0) {
                await this.setCache(dataClass, JSON.stringify(tree), isOpen);

            }
        } else {
            tree = JSON.parse(tree);
        }
        return tree;
    }
    async move(treeClassification: TreeClassification, direction: Number, req: any): Promise<any> {
        if (direction == -1 && treeClassification.sort >= treeClassification.breathCount) {
            throw new Error("已经排到最后了");
        }
        if (direction == 1 && treeClassification.sort <= 1) {
            throw new Error("已经排到第一了");
        }
        this.clearCache(treeClassification.dataClass);
        const session = await this.transaction.startTransactionAuto();
        const moveItem = () => new Promise(async (res, rej) => {
            session.withTransaction(async () => {
                treeClassification.updateUser = req?.user?.userName;
                treeClassification.updateDate = new Date();
                delete treeClassification.addDate;
                delete treeClassification.addUser;
                if (direction == 1) {

                    // 自己上一个节点下移
                    await this.TreeClassificationModel.updateOne(
                        {
                            parent: treeClassification.parent,
                            sort: treeClassification.sort - 1,
                            dataClass: treeClassification.dataClass
                        },
                        {
                            $set: {
                                sort: treeClassification.sort,
                                updateUser: req?.user?.userName,
                                updateDate: new Date()
                            }
                        }
                        , {
                            session
                        }
                    )
                    // 自己上移
                    treeClassification.sort -= 1;
                } else if (direction == -1) {

                    // 自己下一个节点上移
                    await this.TreeClassificationModel.updateOne(
                        {
                            parent: treeClassification.parent,
                            sort: treeClassification.sort + 1,
                            dataClass: treeClassification.dataClass
                        },
                        {
                            $set: {
                                sort: treeClassification.sort,
                                updateUser: req?.user?.userName,
                                updateDate: new Date()
                            }
                        }
                        , {
                            session
                        }
                    )
                    // 自己下移
                    treeClassification.sort += 1;
                }
                res(await this.TreeClassificationModel.findByIdAndUpdate(treeClassification._id, { $set: { ...treeClassification } }, { session }));
            }).catch(err => {
                console.log(err);
                rej(err);
            })

        });
        return await moveItem();
    }
}

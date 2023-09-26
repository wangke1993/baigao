import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { ModuleConf } from './dto/module-conf.schema';
import { ModuleField } from './dto/module-field.schema';
import { ModuleSearch } from './dto/module-search.schema';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { UUID } from 'src/utils/random-tools';
import { BackendFile, CreateCodeConfDto, CreateConf } from './dto/create-code-conf.dto';
import { DevTools } from './dev-tools';

@Injectable()
export class SystemDevService {

    constructor(
        @InjectModel(ModuleConf.name) private moduleConf: Model<ModuleConf>,
        @InjectModel(ModuleField.name) private moduleField: Model<ModuleField>,
        @InjectModel(ModuleSearch.name) private moduleSearch: Model<ModuleSearch>,
        private transactionHelper: TransactionHelper
    ) { };


    async deleteConfById(id: string): Promise<any> {
        const session = await this.transactionHelper.startTransactionAuto();
        const del = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                try {
                    const dto = await this.moduleConf.findById(id);
                    await this.deleteFieldByModuleUUID(dto.UUID);
                    await this.deleteSearchByModuleUUID(dto.UUID);
                    res(await this.moduleConf.deleteOne({ _id: new ObjectId(id) }))
                } catch (error) {
                    rej(error);
                }
            })
        });
        return del();
    }
    async deleteFieldById(id: string): Promise<any> {
        const session = await this.transactionHelper.startTransactionAuto();
        const del = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                try {
                    const field = await this.moduleField.findById(id);
                    // 删除对应搜索字段
                    await this.moduleSearch.deleteOne({ fieldUUID: field.UUID });
                    // 删除字段
                    res(await this.moduleField.deleteOne({ _id: new ObjectId(id) }));
                } catch (error) {
                    rej(error);
                }
            });
        });
        return await del();
    }
    async deleteFieldByModuleUUID(moduleUUID: string): Promise<any> {
        return this.moduleField.deleteMany({ moduleUUID });
    }
    async deleteSearchById(id: string): Promise<any> {
        return this.moduleSearch.deleteOne({ _id: new ObjectId(id) });
    }
    async deleteSearchByModuleUUID(moduleUUID: string): Promise<any> {
        return this.moduleSearch.deleteMany({ moduleUUID });
    }
    async createConf(moduleConfDto: ModuleConf, req: any): Promise<ModuleConf> {
        moduleConfDto.updateUser = req?.user?.userName;
        moduleConfDto.updateDate = new Date();
        moduleConfDto.addUser = req?.user?.userName;
        moduleConfDto.addDate = new Date();
        moduleConfDto.UUID = UUID();
        // 英文名称不能重复
        if (((await this.moduleConf.findOne({ nameEn: moduleConfDto.nameEn }))?.UUID)) {
            throw new Error("英文名称不能重复");
        }
        return new this.moduleConf(moduleConfDto).save();
    }
    async createField(moduleFieldDto: ModuleField, req: any): Promise<ModuleField> {
        moduleFieldDto.updateUser = req?.user?.userName;
        moduleFieldDto.updateDate = new Date();
        moduleFieldDto.addUser = req?.user?.userName;
        moduleFieldDto.addDate = new Date();
        moduleFieldDto.UUID = UUID();
        // 英文名称不能重复
        if (((await this.moduleField.findOne({ nameEn: moduleFieldDto.nameEn }))?.UUID)) {
            throw new Error("英文名称不能重复");
        }
        return new this.moduleField(moduleFieldDto).save();
    }
    async createSearch(moduleSearchDto: ModuleSearch, req: any): Promise<ModuleSearch> {
        moduleSearchDto.updateUser = req?.user?.userName;
        moduleSearchDto.updateDate = new Date();
        moduleSearchDto.addUser = req?.user?.userName;
        moduleSearchDto.addDate = new Date();
        // 字段不能重复
        if (((await this.moduleSearch.findOne({ fieldUUID: moduleSearchDto.fieldUUID }))?._id)) {
            throw new Error("一个字段仅可配置一次");
        }
        return new this.moduleSearch(moduleSearchDto).save();
    }
    async updateConf(dto: ModuleConf, UUID: string, req: any): Promise<any> {
        dto.updateUser = req?.user?.userName;
        dto.updateDate = new Date();
        return await this.moduleConf.updateOne({ UUID }, { $set: { ...dto } });
    }
    async updateField(dto: ModuleField, UUID: string, req: any): Promise<any> {
        dto.updateUser = req?.user?.userName;
        dto.updateDate = new Date();
        delete dto.moduleUUID;
        const session = await this.transactionHelper.startTransactionAuto();
        const update = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                try {
                    // 同步更新搜索字段
                    const { UUID: fieldUUID, name: fieldName, nameEn: fieldEnName, dom, domDataUrl, dataValueField, dataLabelField, dataChildField, type: fieldType } = dto;
                    await this.moduleSearch.updateOne({ fieldUUID }, { $set: { fieldName, fieldEnName, dom, domDataUrl, dataValueField, dataLabelField, dataChildField, fieldType } })
                    res(await this.moduleField.updateOne({ UUID }, { $set: { ...dto } }));
                } catch (error) {
                    rej(error);
                }
            });
        });
        return await update();
    }
    async updateSearch(dto: ModuleSearch, id: string, req: any): Promise<any> {
        dto.updateUser = req?.user?.userName;
        dto.updateDate = new Date();
        delete dto.fieldEnName;
        delete dto.fieldUUID;
        return await this.moduleSearch.findByIdAndUpdate(id, { $set: { ...dto } });
    }
    async getModuleList(keyWord: String): Promise<ModuleConf[]> {
        if (keyWord) {
            return await this.moduleConf.find({
                $or: [
                    { name: { $regex: keyWord } },
                    { nameEn: { $regex: keyWord } },
                    { remakes: { $regex: keyWord } }
                ]
            });
        } else {
            return await this.moduleConf.find();
        }
    }
    async getModuleFieldList(moduleUUID: String, keyWord: String): Promise<ModuleField[]> {
        if (keyWord) {
            return await this.moduleField.find({
                $or: [
                    { name: { $regex: keyWord } },
                    { nameEn: { $regex: keyWord } }
                ],
                moduleUUID
            });
        } else {
            return await this.moduleField.find({ moduleUUID });
        }
    }
    async getModuleSearchList(moduleUUID: String): Promise<ModuleSearch[]> {
        return await this.moduleSearch.find({ moduleUUID });
    }
    async createCode(UUID: String, createCodeConfDto: CreateCodeConfDto): Promise<any> {
        /**
         * 生成后端代码
         *  增删改查
         */
        createCodeConfDto.isTemp = true;
        createCodeConfDto.backend = true;
        createCodeConfDto.frontend = false;
        createCodeConfDto.config = new CreateConf();
        createCodeConfDto.config.add = true;
        createCodeConfDto.config.del = true;
        createCodeConfDto.config.query = true;
        createCodeConfDto.config.update = true;
        createCodeConfDto.config.UUID = true;
        createCodeConfDto.backendFile = new BackendFile();
        createCodeConfDto.backendFile.controller = false;
        createCodeConfDto.backendFile.dto = true;
        createCodeConfDto.backendFile.module = false;
        createCodeConfDto.backendFile.pageDto = false;
        createCodeConfDto.backendFile.service = false;
        const devTools = new DevTools(createCodeConfDto);
        const moduleConf = await this.moduleConf.findOne({ UUID });
        const fieldList = await this.getModuleFieldList(UUID, "");
        const searchList = await this.getModuleSearchList(UUID);
        devTools.createModuleDir(moduleConf.nameEn);
        if (devTools.conf.backend) {
            devTools.createDto(moduleConf, fieldList, searchList);
            devTools.createService(moduleConf, searchList);
            devTools.createController(moduleConf, searchList);
            devTools.createModule(moduleConf);
        }
        if (devTools.conf.frontend) {
            // TODO:生成前端

        }

    }
}

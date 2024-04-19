import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { WalletManagement, WalletManagementDocument } from './dto/wallet-management.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto'; import { UUID } from 'src/utils/random-tools';
import { WalletLogDto } from './dto/wallet-log.dto';
import { WalletLog, WalletLogDocument } from './dto/wallet-log.schema';
import { WalletManagementDto } from './dto/wallet-management.dto';

@Injectable()
export class WalletManagementService {
    private readonly logger = new Logger(WalletManagementService.name);
    constructor(
        @InjectModel(WalletManagement.name) private walletManagementModel: Model<WalletManagementDocument>,
        @InjectModel(WalletLog.name) private walletLogModel: Model<WalletLogDocument>,
        private fileUploadService: FileUploadService,
        private transactionHelper: TransactionHelper
    ) { };

    async create(data: WalletManagement, req: any): Promise<WalletManagement> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();
        data.UUID = UUID();
        return new this.walletManagementModel(data).save();
    }

    async deleteById(id: string): Promise<any> {
        const data = await this.walletManagementModel.findOne({ _id: new ObjectId(id) });
        this.logger.warn("删除数据", data);
        if (data) {
            // 删除文件
            data.fileIds.forEach(k => {
                try {
                    this.fileUploadService.delete(k)
                } catch (error) {
                    this.logger.error(error);
                }
            })
        } else {
            throw new Error("数据不存在");
        }
        return this.walletManagementModel.deleteOne({ _id: new ObjectId(id) });
    }

    async deleteByUUID(UUID: string): Promise<any> {
        const data = await this.walletManagementModel.findOne({ UUID });
        if (data) {
            // 删除文件
            data.fileIds.forEach(k => {
                try {
                    this.fileUploadService.delete(k)
                } catch (error) {
                    this.logger.error(error);
                }
            })
        } else {
            throw new Error("数据不存在");
        }
        return this.walletManagementModel.deleteOne({ UUID });
    }
    async deleteByBindUserUUID(bindUserUUID: string, session?: any): Promise<any> {
        const data = await this.walletManagementModel.findOne({ bindUserUUID });
        if (!data) {
            throw new Error("钱包不存在");
        }
        this.logger.warn(`删除钱包:${JSON.stringify(data)}`);
        const map = { walletUUID: data.UUID }
        const logs = await this.walletLogModel.find(map);
        this.logger.warn(`删除钱包流水:${JSON.stringify(logs)}`);
        await this.walletLogModel.deleteMany(map, { session });
        return await this.walletManagementModel.deleteOne({ bindUserUUID }, { session });;
    }

    async update(data: WalletManagement, id: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.walletManagementModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    }

    async updateByUUID(data: WalletManagement, UUID: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.walletManagementModel.updateOne({ UUID }, { $set: { ...data } });
    }

    async getPage(page: PageRequestDto): Promise<PageResponseDto<WalletManagement>> {
        const keyWord = page?.keyWord ? page?.keyWord : '';

        const map: any = {
            $or: [

                { remarks: { $regex: keyWord } },

            ]
        };

        const pageData = new PageResponseDto<WalletManagement>();
        pageData.total = await this.walletManagementModel.countDocuments(map, { content: 0 });
        pageData.list = await this.walletManagementModel.find(map, { content: 0 }).limit(page.pageSize).skip((page.pageIndex - 1) * page.pageSize).sort({ updateDate: -1 });
        return pageData;
    }

    async getDetailById(id: string): Promise<WalletManagement> {
        let map: any = { _id: new ObjectId(id) }
        return await this.walletManagementModel.findOne(map);
    }

    async getDetailByUUID(UUID: string): Promise<WalletManagement> {
        let map: any = { UUID }
        return await this.walletManagementModel.findOne(map);
    }
    async getDetailByBindUserUUID(bindUserUUID: string): Promise<WalletManagement> {
        let map: any = { bindUserUUID }
        return await this.walletManagementModel.findOne(map);
    }

    async getByIds(ids: string[]): Promise<WalletManagement[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.walletManagementModel.find(map);
    }

    async getByUUIDs(UUIDs: string[]): Promise<WalletManagement[]> {
        let map: any = { UUID: { $in: UUIDs } }
        return await this.walletManagementModel.find(map);
    }

    async getList(count?: number): Promise<WalletManagement[]> {
        let map: any = {};
        if (count) {
            return await this.walletManagementModel.find(map).limit(count);
        } else {
            return await this.walletManagementModel.find(map);
        }
    }
    /**
     * 创建用户钱包
     */
    async createByBindUserUUID(bindUserUUID: string, req: any, remarks?: string, session?: any): Promise<WalletManagement> {
        const data = new WalletManagementDto(bindUserUUID, req);
        data.UUID = UUID();
        data.remarks = remarks;
        return new this.walletManagementModel(data).save({ session });
    }

    /**
     * 收入
     */
    async income(bindUserUUID: string, amount: number, remarks: string, req: any): Promise<any> {
        /**
         * 钱包金额增加，总收入增加
         * 插入钱包明细
         */
        const wallet = await this.walletManagementModel.findOne({ bindUserUUID });
        if (wallet) {
            if (wallet.freeze) {
                throw new Error("钱包被冻结,无法操作");
            }
            const session = await this.transactionHelper.startTransactionAuto();
            const update = () => new Promise((res, rej) => {
                session.withTransaction(async () => {
                    let { _id: id, UUID, balance, totalIncome } = wallet;
                    totalIncome += Number(amount);
                    balance += Number(amount);
                    const data = await this.walletManagementModel.findByIdAndUpdate(
                        id,
                        {
                            $set: {
                                totalIncome,
                                balance,
                                updateDate: new Date(),
                                updateUser: req?.user?.userName
                            }
                        }, { session });
                    const walletLogDto = new WalletLogDto(UUID, amount, balance, req).income();
                    walletLogDto.remarks = remarks;
                    await new this.walletLogModel(walletLogDto).save({ session });
                    res(data);
                }).catch(err => {
                    console.log(err);
                    rej(err)
                });
            })
            return await update();
        } else {
            throw new Error("钱包不存在");
        }
    }
    /**
     * 联动收入
     */
    async linkageIncome(bindUserUUID: string, amount: number, remarks: string, req: any, session: any): Promise<any> {
        /**
         * 钱包金额增加，总收入增加
         * 插入钱包明细
         */
        const wallet = await this.walletManagementModel.findOne({ bindUserUUID });
        if (wallet) {
            if (wallet.freeze) {
                throw new Error("钱包被冻结,无法操作");
            }
            let { _id: id, UUID, balance, totalIncome } = wallet;
            totalIncome += Number(amount);
            balance += Number(amount);
            const data = await this.walletManagementModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        totalIncome,
                        balance,
                        updateDate: new Date(),
                        updateUser: req?.user?.userName
                    }
                }, { session });
            const walletLogDto = new WalletLogDto(UUID, amount, balance, req).income();
            walletLogDto.remarks = remarks;
            return await new this.walletLogModel(walletLogDto).save({ session });
        } else {
            throw new Error("钱包不存在");
        }
    }

    /**
     * 支出
     */
    async expenditure(bindUserUUID: string, amount: number, remarks: string, req: any): Promise<any> {
        /**
         * 钱包金额减少，总支出增加
         * 插入钱包明细
         */
        const wallet = await this.walletManagementModel.findOne({ bindUserUUID });
        if (wallet) {
            if (wallet.freeze) {
                throw new Error("钱包被冻结,无法操作");
            }
            const session = await this.transactionHelper.startTransactionAuto();
            const update = () => new Promise((res, rej) => {
                session.withTransaction(async () => {
                    let { _id: id, UUID, balance, totalExpenditure } = wallet;
                    totalExpenditure += Number(amount);
                    balance -= Number(amount);
                    const data = await this.walletManagementModel.findByIdAndUpdate(
                        id,
                        {
                            $set:
                            {
                                totalExpenditure,
                                balance,
                                updateDate: new Date(),
                                updateUser: req?.user?.userName
                            }
                        }, { session });
                    const walletLogDto = new WalletLogDto(UUID, amount, balance, req).expenditure();
                    walletLogDto.remarks = remarks;
                    await new this.walletLogModel(walletLogDto).save({ session });
                    res(data);
                }).catch(err => {
                    console.log(err);
                    rej(err);
                });
            })
            return await update();
        } else {
            throw new Error("钱包不存在");
        }
    }

    /**
     * 混合支付/订单联动付款
     */
    async mixedPayment(bindUserUUID: string, amount: number, remarks: string, req: any, session: any): Promise<string> {
        /**
         * 钱包金额减少，总支出增加
         * 插入钱包明细
         */
        const wallet = await this.walletManagementModel.findOne({ bindUserUUID });
        if (wallet) {
            if (wallet.freeze) {
                throw new Error("钱包被冻结,无法操作");
            }
            let { _id: id, UUID, balance, totalExpenditure } = wallet;
            totalExpenditure += Number(amount);
            balance -= Number(amount);
            await this.walletManagementModel.findByIdAndUpdate(
                id,
                {
                    $set:
                    {
                        totalExpenditure,
                        balance,
                        updateDate: new Date(),
                        updateUser: req?.user?.userName
                    }
                }, { session });
            const walletLogDto = new WalletLogDto(UUID, amount, balance, req).expenditure();
            walletLogDto.remarks = remarks;
            const res = await new this.walletLogModel(walletLogDto).save({ session });
            return res._id;
        } else {
            throw new Error("钱包不存在");
        }
    }
    /**
     * 混合支付退款
     */
    async mixedPaymentRefund(id: string, remarks: string, req: any, session?: any): Promise<any> {
        const walletLog = await this.walletLogModel.findById(id);
        if (walletLog && !walletLog.refunded) {
            const wallet = await this.walletManagementModel.findOne({ UUID: walletLog.walletUUID });
            let { _id: id, UUID, balance, totalIncome } = wallet;
            totalIncome += Number(walletLog.amount);
            balance += Number(walletLog.amount);
            await this.walletManagementModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        totalIncome,
                        balance,
                        updateDate: new Date(),
                        updateUser: req?.user?.userName
                    }
                }, { session });
            const walletLogDto = new WalletLogDto(UUID, walletLog.amount, balance, req).income();
            walletLogDto.remarks = remarks;
            await new this.walletLogModel(walletLogDto).save({ session });
            await this.walletLogModel.findByIdAndUpdate(walletLog._id, {
                $set: {
                    refunded: true,
                    updateDate: new Date(),
                    updateUser: req?.user?.userName
                }
            });
        }
    }

    async freezeThaw(bindUserUUID: string, req: any): Promise<any> {
        const wallet = await this.walletManagementModel.findOne({ bindUserUUID });
        if (!wallet) {
            throw new Error("钱包不存在");
        }
        let freeze = true;
        if (wallet.freeze == true) {
            freeze = false;
        }
        return await this.walletManagementModel.findByIdAndUpdate(wallet._id, {
            $set: {
                freeze,
                updateDate: new Date(),
                updateUser: req?.user?.userName
            }
        })
    }
    /**
     * 充值生效
     * @param id 
     * @param req 
     * @param session 
     */
    async rechargeEffective(logId: String, req: any, session: any): Promise<any> {
        /**
         * 钱包金额增加，总收入增加
         * 插入钱包明细
         */
        const walletLog = await this.walletLogModel.findById(logId);
        if (!walletLog) {
            throw new Error("充值记录不存在");
        }
        if (walletLog && walletLog.takeEffect) {
            throw new Error("充值已生效");
        }
        const wallet = await this.walletManagementModel.findOne({ UUID: walletLog.walletUUID });
        if (wallet) {
            if (wallet.freeze) {
                throw new Error("钱包被冻结,无法操作");
            }
            let { _id: id, UUID, balance, totalIncome } = wallet;
            totalIncome += Number(walletLog.amount);
            balance += Number(walletLog.amount);
            await this.walletManagementModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        totalIncome,
                        balance,
                        updateDate: new Date(),
                        updateUser: req?.user?.userName
                    }
                }, { session });
            walletLog.updateDate = new Date();
            walletLog.updateUser = req?.user?.userName;
            walletLog.takeEffect = true;
            await this.walletLogModel.findByIdAndUpdate(logId, { $set: { ...walletLog } });
        } else {
            throw new Error("钱包不存在");
        }
    }
}

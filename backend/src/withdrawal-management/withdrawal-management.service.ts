import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { WithdrawalManagement, WithdrawalManagementDocument } from './dto/withdrawal-management.schema';
import { WithdrawalManagementPageDto } from './dto/withdrawal-management-page.dto';
import { SnowflakeID, UUID } from 'src/utils/random-tools';
import { WalletManagementService } from 'src/wallet-management/wallet-management.service';
import { WithdrawalManagementDto } from './dto/withdrawal-management.dto';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { DC0012, DC0013, DC0014 } from 'src/data-dictionary/dic-enum';
import { WeChatApiService } from 'src/wechat-api/wechat-api.service';
import { TransferDetailDto } from 'src/wechat-api/dto/transfer-detail.dto';
import { TRANSFER_SCENE_ID } from 'src/wechat-api/dto/enum.dto';
import { WxMPApiService } from 'src/wechat-api/wx-mp-api.service';
import { MpTplMsgRequestDto } from 'src/wechat-api/dto/mp-tpl-msg-request.dto';
import { MemberManagementService } from 'src/member-management/member-management.service';

/**
 *  提现申请
 */
@Injectable()
export class WithdrawalManagementService {
    private readonly logger = new Logger(WithdrawalManagementService.name);
    constructor(
        @InjectModel(WithdrawalManagement.name) private withdrawalManagementModel: Model<WithdrawalManagementDocument>,
        private fileUploadService: FileUploadService,
        private transactionHelper: TransactionHelper,
        private walletManagementService: WalletManagementService,
        private systemConfigService: SystemConfigService,
        private weChatApiService: WeChatApiService,
        private wxMPApiService: WxMPApiService,
        private memberManagementService: MemberManagementService,

    ) { };

    async create(data: WithdrawalManagementDto, req: any, session: any): Promise<WithdrawalManagement> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();

        return new this.withdrawalManagementModel(data).save({ session });
    }

    async deleteById(id: string): Promise<any> {
        const data = await this.withdrawalManagementModel.findOne({ _id: new ObjectId(id) });
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
        return this.withdrawalManagementModel.deleteOne({ _id: new ObjectId(id) });
    }

    async deleteByUUID(UUID: string): Promise<any> {
        const data = await this.withdrawalManagementModel.findOne({ UUID });
        if (data.status == DC0013.待审核) {
            throw Error('仅能删除拒绝或通过的提现申请');
        }
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
        return this.withdrawalManagementModel.deleteOne({ UUID });
    }

    async update(data: WithdrawalManagement, id: string, req: any, session: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.withdrawalManagementModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } }, { session });
    }

    async updateByUUID(data: WithdrawalManagement, UUID: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.withdrawalManagementModel.updateOne({ UUID }, { $set: { ...data } });
    }

    async getPage(page: WithdrawalManagementPageDto): Promise<PageResponseDto<WithdrawalManagement>> {
        const keyWord = page?.keyWord ? page?.keyWord : '';
        let map: any = {
            $or: [
                { reviewedBy: { $regex: keyWord } }, { remarks: { $regex: keyWord } },
            ]
        };
        if (page.status) {
            map.status = page.status;
        }
        if (page.withdrawal) {
            map.withdrawal = page.withdrawal;
        }
        if (page.walletUUID) {
            map.walletUUID = page.walletUUID;
        }
        const pageData = new PageResponseDto<WithdrawalManagement>();
        pageData.total = await this.withdrawalManagementModel.countDocuments(map, { content: 0 });
        pageData.list = await this.withdrawalManagementModel.find(map, { content: 0 }).limit(page.pageSize).skip((page.pageIndex - 1) * page.pageSize).sort({ updateDate: -1 });
        return pageData;
    }

    async getDetailById(id: string): Promise<WithdrawalManagement> {
        let map: any = { _id: new ObjectId(id) }
        return await this.withdrawalManagementModel.findOne(map);
    }

    async getDetailByUUID(UUID: string): Promise<WithdrawalManagement> {
        let map: any = { UUID }
        return await this.withdrawalManagementModel.findOne(map);
    }

    async getByIds(ids: string[]): Promise<WithdrawalManagement[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.withdrawalManagementModel.find(map);
    }

    async getDetailByUUIDs(UUIDs: string[]): Promise<WithdrawalManagement> {
        let map: any = { UUID: { $in: UUIDs } }
        return await this.withdrawalManagementModel.findOne(map);
    }

    async getList(count?: number): Promise<WithdrawalManagement[]> {
        let map: any = {};
        if (count) {
            return await this.withdrawalManagementModel.find(map).limit(count);
        } else {
            return await this.withdrawalManagementModel.find(map);
        }
    }

    /**
     * 提现申请
     * @param userPort 
     * @param amount 
     * @param req 
     * @returns 
     */
    async withdrawalApplication(userPort: string, amount: number, req: any): Promise<any> {
        // TODO 请根据自己实际情况进行修改
        const withdrawal = new WithdrawalManagementDto(userPort, amount, req);
        const run = () => new Promise<WithdrawalManagement>(async (res, rej) => {
            const session = await this.transactionHelper.startTransactionAuto();
            session.withTransaction(async () => {
                // 钱包扣款
                await this.walletManagementService.mixedPayment(
                    withdrawal.walletBindUserUUID,
                    withdrawal.amount,
                    withdrawal.remarks,
                    req,
                    session
                )
                // 创建申请记录
                res(await this.create(withdrawal, req, session))
            }).catch(err => {
                console.log(err);
                rej(err);
            });
        });
        const data = await run();
        return data;
    }
    /**
     * 拒绝申请
     * @param id 
     * @param reason 
     * @param req 
     */
    async refusalOfApplication(id: string, reason: string, req: any) {
        if (!reason) {
            throw new Error("请填写拒绝原因");
        }
        const withdrawal = await this.withdrawalManagementModel.findById(id);
        if (!withdrawal) {
            throw new Error("申请不存在");
        }
        const run = () => new Promise(async (res, rej) => {
            const session = await this.transactionHelper.startTransactionAuto();
            session.withTransaction(async () => {
                // 钱包扣款
                await this.walletManagementService.linkageIncome(
                    withdrawal.walletBindUserUUID,
                    withdrawal.amount,
                    '提现被拒绝，退回提现金额',
                    req,
                    session
                )
                withdrawal.status = DC0013.拒绝;
                withdrawal.statusText = '拒绝';
                withdrawal.rejectReason = reason;
                // 更新申请记录
                res(await this.update(withdrawal, withdrawal._id, req, session))
            }).catch(err => {
                console.log(err);
                rej(err);
            });
        });
        const data = await run();
        return data;
    }
    /**
     * 审核通过
     * @param id 
     * @param req 
     * @returns 
     */
    async applicationApproved(id: string, req: any): Promise<any> {
        const withdrawal = await this.withdrawalManagementModel.findById(id);
        if (!withdrawal) {
            throw new Error("申请不存在");
        }
        const run = () => new Promise(async (res, rej) => {
            const session = await this.transactionHelper.startTransactionAuto();
            session.withTransaction(async () => {
                withdrawal.status = DC0013.通过;
                withdrawal.statusText = '通过';
                withdrawal.passDate = new Date();
                withdrawal.withdrawalNo = SnowflakeID();
                const transferDetails: TransferDetailDto[] = [];
                const transferDetail = new TransferDetailDto();
                transferDetail.openid = withdrawal.openId;
                transferDetail.out_detail_no = withdrawal.withdrawalNo;
                transferDetail.transfer_amount = withdrawal.amount;
                if (withdrawal.reviewedCheckType != DC0012.会员提现) {
                    // 明细转账金额<0.3元时，不允许填写收款用户姓名
                    if (transferDetail.transfer_amount < 30) {
                        throw new Error("员工最低提现金额,不允许低于0.3元");
                    }
                    transferDetail.transfer_remark = `员工提现`;
                    transferDetail.user_name = JSON.parse(withdrawal.userSnapshot).name
                } else {
                    transferDetail.transfer_remark = `用户提现`;
                }
                transferDetails.push(transferDetail);
                console.log(withdrawal.userSnapshot)
                const result = await this.weChatApiService.batchesTransfer(
                    withdrawal.withdrawalNo,
                    transferDetail.transfer_remark,
                    JSON.parse(withdrawal.userSnapshot).name,
                    transferDetails,
                    withdrawal.reviewedCheckType != DC0012.会员提现
                        ? TRANSFER_SCENE_ID.佣金报酬
                        : TRANSFER_SCENE_ID.分销返佣
                );
                if (!result.success) {
                    throw new Error(result.message);
                }
                withdrawal.withdrawalResult = result.resultStr;
                const data = await this.update(withdrawal, withdrawal._id, req, session);
                res(data);
            }).catch(err => {
                console.log(err);
                rej(err);
            });
        });
        return await run();
    }
}

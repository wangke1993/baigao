import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberManagement, MemberManagementDocument } from './dto/member-management.schema';
import { MemberPageForm } from './dto/member-management-page-form.dto';
import { v4 as uuidV4 } from 'uuid';
import { SystemConfigService } from '../system-config/system-config.service';
import { MemberManagementDTO } from './dto/member-management.dto';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { WeChatRegister } from './dto/wechat-register.dto';
import { UUID } from 'src/utils/random-tools';
import { WalletManagementService } from 'src/wallet-management/wallet-management.service';
import { WalletManagement } from 'src/wallet-management/dto/wallet-management.schema';
import { DC0008 } from 'src/data-dictionary/dic-enum';
import { SystemLogService } from 'src/system-log/system-log.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class MemberManagementService {
    private readonly logger = new Logger(MemberManagementService.name);
    constructor(
        @InjectModel(MemberManagement.name) private memberManagementModel: Model<MemberManagementDocument>,
        private systemConfigService: SystemConfigService,
        private walletManagementService: WalletManagementService,
        private fileUploadService: FileUploadService,
        private transaction: TransactionHelper,
        private redisCacheService: RedisCacheService,
        private systemLogService: SystemLogService,

    ) { };

    async create(data: MemberManagement, req: any): Promise<MemberManagement> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();
        data.UUID = UUID();
        return new this.memberManagementModel(data).save();
    }

    async deleteById(id: string): Promise<any> {
        const data = await this.memberManagementModel.findOne({ _id: new ObjectId(id) });
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
        return this.memberManagementModel.deleteOne({ _id: new ObjectId(id) });
    }

    async deleteByUUID(UUID: string): Promise<any> {
        const data = await this.memberManagementModel.findOne({ UUID });
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
        return this.memberManagementModel.deleteOne({ UUID });
    }

    async update(data: MemberManagement, id: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.memberManagementModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    }
    /**
     * 修改用户在线状态
     * @param UUID 用户UUID
     * @param clientId 不为空则在线，为空则不在线
     * @param req 
     * @returns 
     */
    async updateOnlineStatus(UUID: string, socketId: string, req: any): Promise<any> {
        const member = await this.getDetailByUUID(UUID);
        if (member) {
            if (socketId) {
                // this.systemLogService.create(
                //     '上线',
                //     `会员${member.userName}(${member.openId}),上线(${socketId})`,
                //     { user: member }
                // )
            } else {
                // this.systemLogService.create(
                //     '下线',
                //     `会员${member.userName}(${member.openId}),下线(${member.socketId})`,
                //     { user: member }
                // )
            }
            member.socketId = socketId;
            return await this.update(member, member._id, req);
        }
    }

    /**
     * 让所有用户下线
     */
    async allOffline() {
        await this.memberManagementModel.updateMany({}, { $set: { socketId: "" } });
    }
    /**
     * 在线统计
     */
    async onlineStatistics() {
        const total = await this.memberManagementModel.countDocuments();
        const online = await this.memberManagementModel.countDocuments({ socketId: { $ne: null } });
        return {
            total,
            online,
            offline: total - online
        }

    }
    async updateByUUID(data: MemberManagement, UUID: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.memberManagementModel.updateOne({ UUID }, { $set: { ...data } });
    }
    async getDetailById(id: string): Promise<MemberManagement> {
        let map: any = { _id: new ObjectId(id) }
        return await this.memberManagementModel.findOne(map);
    }

    async getDetailByUUID(UUID: string): Promise<MemberManagement> {
        let map: any = { UUID }
        return await this.memberManagementModel.findOne(map);
    }
    /**
     * 小程序第一次认证登录时，创建业务
     * @returns 
     */
    async createMemberManagement(weChatRegister: WeChatRegister): Promise<MemberManagement> {
        if (!weChatRegister.openId) {
            throw new Error('openId不能为空');
        }
        const memberManagement = new MemberManagementDTO();
        memberManagement.UUID = UUID();
        memberManagement.openId = weChatRegister.openId;
        memberManagement.userName = weChatRegister.userName;
        memberManagement.avatar = weChatRegister.avatar;
        memberManagement.sex = weChatRegister.sex;
        memberManagement.unionID = weChatRegister.unionid;
        memberManagement.addDate = new Date();
        memberManagement.updateDate = new Date();
        memberManagement.memberQR = '';
        memberManagement.phoneNumber = '';
        memberManagement.rank = DC0008.游客;
        // 调用登录接口时，如果是新用户，会在redis中存储unionid;
        const key = `register-${memberManagement.openId}`;
        const unionid = await this.redisCacheService.get(key);
        if (unionid) {
            memberManagement.unionID = unionid;
            await this.redisCacheService.del(key);
        }
        const rankConf = await this.systemConfigService.getDetailByConfSelect(memberManagement.rank);
        if (rankConf && rankConf.confValue) {
            memberManagement.role = rankConf.confValue.split(',');
        } else {
            throw new Error(`没有查到游客(${memberManagement.rank})数据`);
        }
        const session = await this.transaction.startTransactionAuto();
        const create = () => new Promise<any>(async (res, rej) => {
            await session.withTransaction(async () => {
                const memberManagementCreate = await new this.memberManagementModel(memberManagement).save({ session: session });
                this.logger.log("微信会员注册", memberManagement);
                // 创建钱包数据
                await this.walletManagementService.createByBindUserUUID(
                    memberManagement.UUID,
                    { user: { userName: memberManagement.userName } },
                    `会员【${memberManagement.userName ?? memberManagement.openId}】(${JSON.stringify({ UUID: memberManagement.UUID, openId: memberManagement.openId })})的钱包`,
                    session
                )
                res(memberManagementCreate);
            }).catch(err => {
                console.log(err);
                rej(err);
            })
        });
        return await create();
    }
    /**
     * 获取钱包明细
     * @param UUID 用户UUID
     * @returns 
     */
    async getWalletDetail(UUID: string): Promise<WalletManagement> {
        return await this.walletManagementService.getDetailByBindUserUUID(UUID);
    };
    /**
     * 设置会员等级
     * @param UUID 
     * @param rank 
     * @returns 
     */
    async setMemberRank(UUID: String, rank: DC0008, session?: any): Promise<any> {
        let role: string[] = [];
        const rankConf = await this.systemConfigService.getDetailByConfSelect(rank);
        if (rankConf && rankConf.confValue) {
            role = JSON.parse(rankConf.confValue).role;
        } else {
            throw new Error(`没有查到(${rank})数据`);
        }
        return await this.memberManagementModel.updateOne({ UUID: UUID }, { $set: { rank: rank, role: role } }, { session });
    }
    /**
     * 设置会员电话号码
     * @param UUID 会员uuid
     * @param phoneNumber 会员电话号码
     * @returns 
     */
    async setMemberPhoneNumber(UUID: string, phoneNumber: string): Promise<any> {
        return await this.memberManagementModel.updateOne({ UUID: UUID }, { $set: { phoneNumber } });
    }
    async setMemberQR(id: string, QRUrl: string, fileId: string): Promise<any> {
        const member = await this.memberManagementModel.findOne({ _id: new ObjectId(id) }, { fileIds: 1 });
        member.fileIds.push(fileId);
        return await this.memberManagementModel.updateOne({ _id: new ObjectId(id) }, { memberQR: QRUrl, fileIds: member.fileIds });
    }
    /**
     * 获取会员分页
     * @param pageForm 
     * @returns 
     */
    async getMemberPage(pageForm: MemberPageForm): Promise<PageResponseDto<MemberManagement>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { userName: { $regex: keyWord } },
                { phoneNumber: { $regex: keyWord } },
            ]
        };
        if (pageForm.memberRank) {
            map.rank = pageForm.memberRank;
        }
        const pageData = new PageResponseDto<any>();
        pageData.total = await this.memberManagementModel.countDocuments(map, { content: 0 });
        const list = await this.memberManagementModel.find(map, { content: 0 }).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ addDate: -1 });
        for (const key in list) {
            pageData.list.push({
                ...list[key]['_doc'],
                wallet: await this.walletManagementService.getDetailByBindUserUUID(list[key].UUID)
            })
        }
        return pageData;
    }

    /**
     * 根据会员UUID获取会员信息
     * @param UUID 
     * @returns 
     */
    async getMemberByUUID(UUID: String, session?: any): Promise<MemberManagement> {
        if (session) {
            return await this.memberManagementModel.findOne({ UUID: UUID }).session(session);
        } else {
            return await this.memberManagementModel.findOne({ UUID: UUID });
        }
    }
    /**
     * 根据会员UUIDs获取会员列表
     * @param UUIDs
     * @returns 
     */
    async getMemberByUUIDs(UUIDs: string[], session?: any): Promise<MemberManagement[]> {
        if (session) {
            return await this.memberManagementModel.find({ UUID: { $in: UUIDs } }).session(session);
        } else {
            return await this.memberManagementModel.find({ UUID: { $in: UUIDs } });
        }
    }
    /**
     * 根据会员OpenId获取会员信息
     * @param openId 
     * @returns 
     */
    async getMemberByOpenId(openId: string): Promise<MemberManagement> {
        return await this.memberManagementModel.findOne({ openId: openId });
    }
    /**
     * 根据会员OpenId获取会员列表
     * @param openId 
     * @returns 
     */
    async getList(): Promise<MemberManagement[]> {
        return await this.memberManagementModel.find({}, { userName: 1, UUID: 1, openId: 1, avatar: 1, phoneNumber: 1 });
    }
    /**
     * 给会员追加新的角色
     * @param roles 角色1,角色2
     * @param req 
     * @param session 
     */
    async appendRoles(UUID: string, roles: string[], req: any, session?: any): Promise<any> {
        const member = await this.memberManagementModel.findOne({ UUID });
        if (!member) {
            throw new Error("用户不存在");
        }
        const newRoles: string[] = [];
        member.role.map(item => {
            if (!roles.includes(item)) {
                newRoles.push(item);
            }
        })
        return await this.memberManagementModel.updateOne({ UUID }, {
            $set: {
                role: newRoles.concat(roles),
                updateDate: new Date(),
                updateUser: req?.user?.userName
            }
        })
    }
    /**
     * 删除会员指定角色
     * @param roles 角色1,角色2
     * @param req 
     * @param session 
     */
    async removeRoles(UUID: string, roles: string[], req: any, session?: any): Promise<any> {
        const member = await this.memberManagementModel.findOne({ UUID });
        if (!member) {
            throw new Error("用户不存在");
        }
        const newRoles: string[] = [];
        member.role.map(item => {
            if (!roles.includes(item)) {
                newRoles.push(item);
            }
        })
        return await this.memberManagementModel.updateOne({ UUID }, {
            $set: {
                role: newRoles,
                updateDate: new Date(),
                updateUser: req?.user?.userName
            }
        })
    }
}

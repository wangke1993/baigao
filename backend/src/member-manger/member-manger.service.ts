import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberManger, MemberMangerDocument } from './dto/member-manger.schema';
import { MemberPageForm } from './dto/member-manger-page-form.dto';
import { AddrManger, AddrMangerDocument } from './dto/addrs-manger.schema';
import { v4 as uuidV4 } from 'uuid';
import { DC0008 } from '../system-config/dto/system-config.schema';
import { SystemConfigService } from '../system-config/system-config.service';
import { MemberMangerDTO } from './dto/member-manger.dto';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { WeChatRegister } from './dto/wechat-register.dto';

@Injectable()
export class MemberMangerService {
    constructor(
        @InjectModel(MemberManger.name) private MemberMangerModel: Model<MemberMangerDocument>,
        @InjectModel(AddrManger.name) private AddrMangerModel: Model<AddrMangerDocument>,
        private systemConfigService: SystemConfigService,
        private fileUploadService: FileUploadService,
        private transaction: TransactionHelper,
    ) { };
    /**
     * 小程序第一次认证登录时，创建业务
     * @returns 
     */
    async createMemberManger(weChatRegister: WeChatRegister): Promise<MemberManger> {
        if (!weChatRegister.openId || !weChatRegister.avatar || !weChatRegister.userName) {
            throw new Error('openId/avatar/userName字段不能为空');
        }
        const UUID = uuidV4();
        const memberManger = new MemberMangerDTO();
        memberManger.UUID = UUID;
        memberManger.openId = weChatRegister.openId;
        memberManger.userName = weChatRegister.userName;
        memberManger.avatar = weChatRegister.avatar;
        memberManger.sex = weChatRegister.sex;
        memberManger.addDate = new Date();
        memberManger.updateDate = new Date();
        memberManger.memberQR = '';
        memberManger.phoneNumber = '';
        memberManger.rank = DC0008.游客;
        const rankConf = await this.systemConfigService.getDetailByConfSelect(memberManger.rank);
        if (rankConf && rankConf.confValue) {
            memberManger.role = rankConf.confValue.split(',');
        } else {
            throw new Error(`没有查到游客(${memberManger.rank})数据`);
        }
        const session = await this.transaction.startTransactionAuto();
        const create = () => new Promise<any>(async (res, rej) => {
            await session.withTransaction(async () => {
                const memberMangerCreate = await new this.MemberMangerModel(memberManger).save({ session: session });
                res(memberMangerCreate);
            }).catch(err => {
                rej(err);
            })
        });
        return await create();
    }
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
        return await this.MemberMangerModel.updateOne({ UUID: UUID }, { $set: { rank: rank, role: role } }, { session });
    }
    /**
     * 设置会员电话号码
     * @param UUID 会员uuid
     * @param phoneNumber 会员电话号码
     * @returns 
     */
    async setMemberPhoneNumber(UUID: string, phoneNumber: string): Promise<any> {
        return await this.MemberMangerModel.updateOne({ UUID: UUID }, { $set: { phoneNumber } });
    }
    async setMemberQR(id: string, QRUrl: string, fileId: string): Promise<any> {
        const member = await this.MemberMangerModel.findOne({ _id: new ObjectId(id) }, { fileIds: 1 });
        member.fileIds.push(fileId);
        return await this.MemberMangerModel.updateOne({ _id: new ObjectId(id) }, { memberQR: QRUrl, fileIds: member.fileIds });
    }
    /**
     * 获取会员分页
     * @param pageForm 
     * @returns 
     */
    async getMemberPage(pageForm: MemberPageForm): Promise<PageResponseDto<MemberManger>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { userName: { $regex: keyWord } },
            ]
        };
        if (pageForm.memberRank) {
            map.rank = pageForm.memberRank;
        }
        const pageData = new PageResponseDto<MemberManger>();
        pageData.total = await this.MemberMangerModel.countDocuments(map, { content: 0 });
        pageData.list = await this.MemberMangerModel.find(map, { content: 0 }).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ addDate: -1 });
        return pageData;
    }

    /**
     * 根据会员UUID获取会员信息
     * @param UUID 
     * @returns 
     */
    async getMemberByUUID(UUID: String, session?: any): Promise<MemberManger> {
        if (session) {
            return await this.MemberMangerModel.findOne({ UUID: UUID }).session(session);
        } else {
            return await this.MemberMangerModel.findOne({ UUID: UUID });
        }
    }
    /**
     * 根据会员UUIDs获取会员列表
     * @param UUIDs
     * @returns 
     */
    async getMemberByUUIDs(UUIDs: string[], session?: any): Promise<MemberManger[]> {
        if (session) {
            return await this.MemberMangerModel.find({ UUID: { $in: UUIDs } }).session(session);
        } else {
            return await this.MemberMangerModel.find({ UUID: { $in: UUIDs } });
        }
    }
    /**
     * 根据会员OpenId获取会员信息
     * @param openId 
     * @returns 
     */
    async getMemberByOpenId(openId: string): Promise<MemberManger> {
        return await this.MemberMangerModel.findOne({ openId: openId });
    }
    // 新增会员地址
    async addMemberAddr(addrManger: AddrManger, req: any): Promise<AddrManger> {
        const session = await this.transaction.startTransactionAuto();
        const add = () => new Promise<AddrManger>((res, rej) => {
            session.withTransaction(async () => {
                addrManger.addUser = req?.user?.userName;
                addrManger.addDate = new Date();
                addrManger.memberUUID = req?.user?.UUID;
                // 重置默认地址
                if (addrManger.default) {
                    await this.AddrMangerModel.updateMany({ memberUUID: addrManger.memberUUID, default: true }, { default: false }, { session: session })
                }
                const save = await new this.AddrMangerModel(addrManger).save({ session: session });
                res(save);
            }).catch(error => {
                res(error);
            })
        })
        return await add();
    }
    // 删除会员地址
    async delMemberAddr(id: string, memberUUID: string): Promise<any> {
        return await this.AddrMangerModel.deleteOne({ _id: new ObjectId(id), memberUUID: memberUUID });
    }
    // 编辑会员地址
    async editMemberAddr(id: string, addrManger: AddrManger, req: any): Promise<any> {
        const session = await this.transaction.startTransactionAuto();
        addrManger.memberUUID = req?.user?.UUID;
        const addr = await this.AddrMangerModel.findOne({ _id: new ObjectId(id), memberUUID: addrManger.memberUUID });
        if (!addr) {
            throw new Error("仅可修改自己的地址信息");
        }
        addrManger.updateUser = req?.user?.userName;
        addrManger.updateDate = new Date();
        delete addrManger.addDate;
        const edit = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                if (addrManger.default) {
                    await this.AddrMangerModel.updateOne({ _id: { $ne: new ObjectId(id) }, default: true }, { default: false }, { session: session })
                }
                const update = await this.AddrMangerModel.updateOne({ _id: new ObjectId(id) }, { ...addrManger }, { session: session });
                res(update);
            }).catch(error => {
                rej(error);
            })
        });
        return await edit();
    }
    // 获取会员地址列表
    async getMemberAddrList(memberUUID: string): Promise<AddrManger[]> {
        return await this.AddrMangerModel.find({ memberUUID: memberUUID }).sort({
            default: -1,
            addDate: 1
        });
    }
}

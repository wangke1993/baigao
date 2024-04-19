import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { WxMpUser, WxMpUserDocument } from './dto/wx-mp-user.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { WxMpUserDto } from './dto/wx-mp-user.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
@Injectable()
export class WxMpUserService {
    private readonly logger = new Logger(WxMpUserService.name);
    constructor(
        @InjectModel(WxMpUser.name) private wxMpUserModel: Model<WxMpUserDocument>,
        private fileUploadService: FileUploadService,
        private transactionHelper: TransactionHelper,
        private redisCacheService: RedisCacheService
    ) { };

    async create(data: WxMpUser, req: any): Promise<WxMpUser> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();

        return new this.wxMpUserModel(data).save();
    }
    async installMany(list: WxMpUserDto[]) {
        return await this.wxMpUserModel.insertMany(list);
    }
    async getLaster(): Promise<WxMpUser> {
        return await this.wxMpUserModel.findOne().sort({ addDate: -1 });
    }
    async deleteById(id: string): Promise<any> {
        const data = await this.wxMpUserModel.findOne({ _id: new ObjectId(id) });
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
        return this.wxMpUserModel.deleteOne({ _id: new ObjectId(id) });
    }

    async update(data: WxMpUser, id: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.wxMpUserModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    }
    async updateByOpenId(data: WxMpUserDto, openid: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.wxMpUserModel.updateOne({ openid }, { $set: { ...data } });
    }


    async getPage(page: PageRequestDto): Promise<PageResponseDto<WxMpUser>> {
        const map: any = {};
        const pageData = new PageResponseDto<WxMpUser>();
        pageData.total = await this.wxMpUserModel.countDocuments(map, { content: 0 });
        pageData.list = await this.wxMpUserModel.find(map, { content: 0 }).limit(page.pageSize).skip((page.pageIndex - 1) * page.pageSize).sort({ updateDate: -1 });
        return pageData;
    }

    async getDetailById(id: string): Promise<WxMpUser> {
        let map: any = { _id: new ObjectId(id) }
        return await this.wxMpUserModel.findOne(map);
    }
    /**
     * 根据unionid获取微信公众号用户信息
     * @param unionid 
     * @returns 
     */
    async getDetailByUnionid(unionid: string): Promise<WxMpUser> {
        let map: any = { unionid }
        return await this.wxMpUserModel.findOne(map);
    }

    async getByIds(ids: string[]): Promise<WxMpUser[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.wxMpUserModel.find(map);
    }
    async getByOpenIds(openIds: string[]): Promise<WxMpUser[]> {
        let map: any = { openid: { $in: openIds } };
        return await this.wxMpUserModel.find(map);
    }
    async deleteByOpenIds(openIds: string[]): Promise<any> {
        let map: any = { openid: { $in: openIds } };
        return await this.wxMpUserModel.deleteMany(map);
    }
    async deleteNotInOpenIds(openIds: string[]): Promise<number> {
        let map: any = { openid: { $nin: openIds } };
        const { deletedCount } = await this.wxMpUserModel.deleteMany(map);
        console.log('删除结果', { deletedCount });
        return deletedCount;
    }
    async getNewUser(openIds: string[]): Promise<any> {
        const allList = await this.wxMpUserModel.find({}, { openid: 1 });
        if (allList.length == 0) {
            return openIds;
        }
        const oldOpenIds = allList.map(item => item.openid);
        // 在openIds中，不在oldOpenIds中；
        return openIds.filter(str => !oldOpenIds.includes(str));
    }

    async getList(count?: number): Promise<WxMpUser[]> {
        let map: any = {};
        if (count) {
            return await this.wxMpUserModel.find(map).limit(count);
        } else {
            return await this.wxMpUserModel.find(map);
        }
    }
}

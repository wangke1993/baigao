import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AdminUser, AdminUserDocument } from './dto/admin-user.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import * as crypto from 'crypto';
import stringRandom from 'string-random';
@Injectable()
export class AdminUserService {
    /**
     * 角色模块的自身管理
     */
    private SALT_CODE: string;
    constructor(@InjectModel(AdminUser.name) private AdminUserModel: Model<AdminUserDocument>) {
        this.SALT_CODE = process.env.SALT_CODE;
    };

    async deleteById(id: string): Promise<any> {
        return this.AdminUserModel.deleteMany({ _id: new ObjectId(id) });
    }
    async create(adminUser: AdminUser): Promise<AdminUser> {
        return new this.AdminUserModel(adminUser).save();
    }
    async initAdminUser(password: String, userName = 'baigao'): Promise<any> {
        return await this.AdminUserModel.updateOne({ userName }, { $set: { password } });
    }
    async update(adminUser: AdminUser, id: string): Promise<any> {
        return await this.AdminUserModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...adminUser } });
    }
    async updatePassword(password: string, id: string): Promise<any> {
        return await this.AdminUserModel.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
    }
    async resetPassword(id: string): Promise<string> {
        const newPassword = stringRandom(); //生成8为随机字符串
        const password = crypto.createHash('md5').update(newPassword + this.SALT_CODE).digest('hex');
        await this.AdminUserModel.updateOne({ _id: new ObjectId(id) }, { $set: { password } });
        return newPassword;
    }
    async getAdminUserById(id: string): Promise<AdminUser> {
        return await this.AdminUserModel.findOne({ _id: new ObjectId(id) })
    }
    async getAdminUserByRoleId(roleId: string): Promise<AdminUser> {
        return await this.AdminUserModel.findOne({ role: roleId });
    }
    async getAdminUserByUserNameAndPassWord(userName: string, password: string): Promise<AdminUser> {
        password = crypto.createHash('md5').update(password + this.SALT_CODE).digest('hex');
        return await this.AdminUserModel.findOne({ userName, password })
    }
    async getPage(pageForm: PageRequestDto): Promise<PageResponseDto<AdminUser>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map = {
            $or: [
                { roleName: { $regex: keyWord } },
                { userName: { $regex: keyWord } },
            ]
        };
        const pageData = new PageResponseDto<AdminUser>();
        pageData.total = await this.AdminUserModel.countDocuments(map);
        pageData.list = await this.AdminUserModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize)
        return pageData;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from "mongodb";
import { RolePermissions, RolePermissionsDocument } from './dto/role-permissions.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { AdminUserService } from 'src/admin-user/admin-user.service';

@Injectable()
export class RolePermissionsService {
    /**
     * 角色模块的自身管理
     */
    constructor(@InjectModel(RolePermissions.name) private RolePermissionsModel: Model<RolePermissionsDocument>
        , private adminUserService: AdminUserService) { };

    async deleteById(id: string): Promise<any> {

        const adminUser = await this.adminUserService.getAdminUserByRoleId(id);
        if (!adminUser) {
            return this.RolePermissionsModel.deleteMany({ _id: new ObjectId(id) });
        } else {
            throw new Error("该角色正在被使用");
        }
    }
    async getRoleById(id: string): Promise<RolePermissions> {
        return await this.RolePermissionsModel.findOne({ _id: new ObjectId(id) });
    }
    async create(RolePermissions: RolePermissions): Promise<RolePermissions> {
        return new this.RolePermissionsModel(RolePermissions).save();
    }
    async update(RolePermissions: RolePermissions, id: string): Promise<any> {
        return await this.RolePermissionsModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...RolePermissions } });
    }
    async getPage(pageForm: PageRequestDto): Promise<PageResponseDto<RolePermissions>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map = {
            $or: [
                { roleName: { $regex: keyWord } },
            ]
        };
        const pageData = new PageResponseDto<RolePermissions>();
        pageData.total = await this.RolePermissionsModel.countDocuments(map);
        pageData.list = await this.RolePermissionsModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize)
        return pageData;
    }
    async getList(): Promise<RolePermissions[]> {
        return await this.RolePermissionsModel.find();
    }
    /**
     * 根据角色id数组获取菜单功能id数组
     * @param ids 
     * @returns 
     */
    async getRolePermissionsListByIds(ids: string[]): Promise<string[]> {
        const objectIds: ObjectId[] = [];
        let permissionsList: string[] = [];
        ids.forEach((id: string) => {
            objectIds.push(new ObjectId(id));
        });
        const roleList = await this.RolePermissionsModel.find({ _id: { $in: objectIds } });
        roleList.forEach((role: RolePermissions) => {
            permissionsList = permissionsList.concat(role.permissionsList);
        });
        return permissionsList;
    }
    /**
     * 根据角色Ids判断是否存在是超级用户
     * @param ids 
     * @returns 
     */
    async isSuperByIds(ids: string[]): Promise<boolean> {
        const objectIds: ObjectId[] = [];
        ids.forEach((id: string) => {
            objectIds.push(new ObjectId(id));
        });
        const roleList = await this.RolePermissionsModel.find({ _id: { $in: objectIds }, isSuper: true });
        return roleList.length > 0;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { AdminMenuTreeDto } from './dto/admin-menu-tree.dto';
import { AdminMenu, AdminMenuDocument } from './dto/admin-menu.schema';

@Injectable()
export class AdminMenuService {
    /**
     * 菜单模块的自身管理
     * 获取当前登录用户的菜单树
     * 新增菜单/删除菜单/修改菜单/查询菜单
     */
    constructor(@InjectModel(AdminMenu.name) private adminMenuModel: Model<AdminMenuDocument>) { };

    async getTree(menuType: number, menuIds?: string[]): Promise<AdminMenuTreeDto[]> {
        const tree: AdminMenuTreeDto[] = [];
        const menuListTree: AdminMenuTreeDto[] = [];
        let list: any[] = [];
        let map: any = {};
        if (menuIds) {
            const objectIds: any[] = [];
            menuIds.forEach((id) => {
                if (id !== 'division') {
                    objectIds.push(new ObjectId(id));
                }
            });
            map = {
                _id: { $in: objectIds }
            }
        }
        if (menuType > 0) {
            map.menuType = menuType;
        }
        list = await this.adminMenuModel.find(map).sort({ sort: 1 });
        const getChild = (parentId: string) => {
            const childrenList = list.filter(item => item.parentId === parentId);
            list = list.filter(item => item.parentId !== parentId);
            const childrenTree: AdminMenuTreeDto[] = [];
            childrenList.forEach((item: AdminMenu) => {
                const children = getChild(item._id.toString());
                let adminMenuTreeDto = new AdminMenuTreeDto(item);
                adminMenuTreeDto.children = children;
                childrenTree.push(adminMenuTreeDto);
            });
            return childrenTree;
        }
        const top = list.filter(item => item.parentId === '0' || item.parentId === '');
        list = list.filter(item => item.parentId !== '0');
        top.forEach((item: AdminMenu) => {
            const adminMenuTreeDto = new AdminMenuTreeDto(item);
            const children = getChild(item._id.toString());
            adminMenuTreeDto.children = children;
            tree.push(adminMenuTreeDto);
        });

        return tree;
    }
    async deleteById(id: string): Promise<any> {
        return this.adminMenuModel.deleteMany({
            $or: [
                { _id: new ObjectId(id) },
                { parentDeep: { $eq: id } }
            ]
        });

    }
    async create(adminMenu: AdminMenu): Promise<AdminMenu> {
        return new this.adminMenuModel(adminMenu).save();
    }
    async update(adminMenu: AdminMenu, id: string): Promise<any> {
        return await this.adminMenuModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...adminMenu } });
    }
    async getMenuPowerTagListByIds(ids: string[]): Promise<string[]> {
        const menuPowerTagList: string[] = [];
        const objectIds: ObjectId[] = [];
        ids.forEach((id) => {
            if (id !== 'division') {
                objectIds.push(new ObjectId(id));
            }
        });
        const menuList = await this.adminMenuModel.find({ _id: { $in: objectIds }, menuType: 3 });
        menuList.forEach((menu: AdminMenu) => {
            if (menu.menuPowerTag) {
                menuPowerTagList.push(menu.menuPowerTag);
            }
        });
        return menuPowerTagList;
    }
    /**
     * 获取所有菜单按钮
     * @returns 
     */
    async getAllMenuPowerTagList(): Promise<string[]> {
        const menuPowerTagList: string[] = [];
        const menuList = await this.adminMenuModel.find({
            menuType: 3
        });
        menuList.forEach((menu: AdminMenu) => {
            menuPowerTagList.push(menu.menuPowerTag);
        });
        return menuPowerTagList;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { ModuleConf } from './dto/module-conf.schema';
import { ModuleField } from './dto/module-field.schema';
import { ModuleSearch } from './dto/module-search.schema';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { UUID } from 'src/utils/random-tools';
import { BackendFile, CreateCodeConfDto, CreateConf, FrontEndFile } from './dto/create-code-conf.dto';
import { DevTools } from './dev-tools';
import { AdminMenuService } from 'src/admin-menu/admin-menu.service';
import { AdminMenuDto } from 'src/admin-menu/dto/admin-menu.dto';

@Injectable()
export class SystemDevService {

    constructor(
        @InjectModel(ModuleConf.name) private moduleConf: Model<ModuleConf>,
        @InjectModel(ModuleField.name) private moduleField: Model<ModuleField>,
        @InjectModel(ModuleSearch.name) private moduleSearch: Model<ModuleSearch>,
        private transactionHelper: TransactionHelper,
        private adminMenuService: AdminMenuService
    ) {
    };


    async deleteConfById(id: string): Promise<any> {
        const session = await this.transactionHelper.startTransactionAuto();
        const del = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                try {
                    const dto = await this.moduleConf.findById(id);
                    await this.deleteFieldByModuleUUID(dto.UUID, session);
                    await this.deleteSearchByModuleUUID(dto.UUID, session);
                    res(await this.moduleConf.deleteOne({ _id: new ObjectId(id) }, { session }))
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
                    await this.moduleSearch.deleteOne({ fieldUUID: field.UUID }, { session });
                    // 删除字段
                    res(await this.moduleField.deleteOne({ _id: new ObjectId(id) }, { session }));
                } catch (error) {
                    rej(error);
                }
            });
        });
        return await del();
    }
    async deleteFieldByModuleUUID(moduleUUID: string, session?: any): Promise<any> {
        return this.moduleField.deleteMany({ moduleUUID }, { session });
    }
    async deleteSearchById(id: string): Promise<any> {
        return this.moduleSearch.deleteOne({ _id: new ObjectId(id) });
    }
    async deleteSearchByModuleUUID(moduleUUID: string, session: any): Promise<any> {
        return this.moduleSearch.deleteMany({ moduleUUID }, { session });
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
        if (((await this.moduleField.findOne({ nameEn: moduleFieldDto.nameEn, moduleUUID: moduleFieldDto.moduleUUID }))?.UUID)) {
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
        const map = {
            UUID: { $ne: UUID },
            nameEn: dto.nameEn,
            moduleUUID: dto.moduleUUID
        }
        const old = await this.moduleField.findOne(map);
        if ((old?.UUID)) {
            throw new Error("英文名称不能重复");
        }
        const session = await this.transactionHelper.startTransactionAuto();
        const update = () => new Promise((res, rej) => {
            session.withTransaction(async () => {
                try {
                    delete dto.moduleUUID;
                    // 同步更新搜索字段
                    const { UUID: fieldUUID, name: fieldName, nameEn: fieldEnName, dom, domDataUrl, dataValueField, dataLabelField, dataChildField, type: fieldType } = dto;
                    await this.moduleSearch.updateOne(
                        { fieldUUID },
                        { $set: { fieldName, fieldEnName, dom, domDataUrl, dataValueField, dataLabelField, dataChildField, fieldType } },
                        { session })
                    res(await this.moduleField.updateOne({ UUID }, { $set: { ...dto } }, { session }));
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
            }).sort({ addDate: -1 });
        } else {
            return await this.moduleConf.find().sort({ addDate: -1 });
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
            return await this.moduleField.find({ moduleUUID }).sort({ sort: 1 });
        }
    }
    async getModuleSearchList(moduleUUID: String): Promise<ModuleSearch[]> {
        return await this.moduleSearch.find({ moduleUUID });
    }
    async createMenu(UUID: String) {

        // 检查menu是否存在
        const moduleConf = await this.moduleConf.findOne({ UUID });
        if (!moduleConf.parentMenu) {
            throw new Error("请选择需要挂载的菜单");
        }
        if (!moduleConf.UUID) {
            throw new Error("模型不存在");
        }
        const devTools = new DevTools();
        const menu = {
            name: moduleConf.name,
            tag: `/business/${devTools.getSmallModuleTitle(moduleConf.nameEn)}`
        }
        const api = [
            {
                name: `创建${moduleConf.name}`,
                tag: `create${devTools.getBigModuleTitle(moduleConf.nameEn)}`
            },
            {
                name: `编辑${moduleConf.name}`,
                tag: `update${devTools.getBigModuleTitle(moduleConf.nameEn)}`
            },
            {
                name: `删除${moduleConf.name}`,
                tag: `delete${devTools.getBigModuleTitle(moduleConf.nameEn)}ById`
            },
            {
                name: `根据id获取${moduleConf.name}详情`,
                tag: `get${devTools.getBigModuleTitle(moduleConf.nameEn)}ById`
            },
            {
                name: `获取${moduleConf.name}分页`,
                tag: `get${devTools.getBigModuleTitle(moduleConf.nameEn)}Page`
            },
        ]
        const btn = [
            {
                name: `添加${moduleConf.name}`,
                tag: `add-${devTools.getSmallModuleTitle(moduleConf.nameEn)}`
            },
            {
                name: `编辑${moduleConf.name}`,
                tag: `edit-${devTools.getSmallModuleTitle(moduleConf.nameEn)}`
            },
            {
                name: `删除${moduleConf.name}`,
                tag: `delete-${devTools.getSmallModuleTitle(moduleConf.nameEn)}`
            },
            {
                name: `保存或更新${moduleConf.name}详情`,
                tag: `save-${devTools.getSmallModuleTitle(moduleConf.nameEn)}`
            },
        ]
        if (!(await this.adminMenuService.menuPowerNotNull(menu.tag))) {
            const adminMenuDto = new AdminMenuDto(menu.name, menu.tag).menu();
            if (moduleConf.parentMenu != '0') {
                const parentMenu = await this.adminMenuService.getById(moduleConf.parentMenu);
                adminMenuDto.parentId = moduleConf.parentMenu;
                adminMenuDto.parentDeep = [...parentMenu.parentDeep, parentMenu._id];
            }
            // 创建菜单
            const adminMenu = await this.adminMenuService.create(adminMenuDto);
            // 创建接口
            api.map(item => {
                this.adminMenuService.create(
                    new AdminMenuDto(
                        item.name,
                        item.tag,
                        adminMenu._id,
                        adminMenu.parentDeep.length ? [...adminMenu.parentDeep, adminMenu._id] : []
                    ).api()
                )
            })
            // 创建按钮
            btn.map(item => {
                this.adminMenuService.create(
                    new AdminMenuDto(
                        item.name,
                        item.tag,
                        adminMenu._id,
                        adminMenu.parentDeep.length ? [...adminMenu.parentDeep, adminMenu._id] : []
                    ).btn()
                )
            })
        } else {
            throw new Error("无需重复挂载");
        }
    }
    async createCode(UUID: String, createCodeConfDto: CreateCodeConfDto) {
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
            // 生成dto
            devTools.createFrontendDto(moduleConf, fieldList);
            // 生成api
            devTools.createFrontendApi(moduleConf, searchList);
            // 生成列表页
            devTools.createListPage(moduleConf, fieldList, searchList);
            // 生成搜索组件
            devTools.createSearchPage(moduleConf, searchList);
            // 生成表单组件
            devTools.createFormPage(moduleConf, fieldList);
        }
        if (!moduleConf.createCount) {
            moduleConf.createCount = 0;
        }
        const createCount = moduleConf.createCount + 1;
        await this.moduleConf.findByIdAndUpdate(moduleConf._id, { $set: { createCount } });
    }
}

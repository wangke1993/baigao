import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { SystemConfig, SystemConfigDocument } from './dto/system-config.schema';
import { SYSTEM_PAGE_CONFIG, SystemConfigPage } from './dto/system-config-page.dto';

@Injectable()
export class SystemConfigService {

    constructor(
        @InjectModel(SystemConfig.name) private SystemConfigModel: Model<SystemConfigDocument>
    ) { };


    async deleteById(id: string): Promise<any> {
        return this.SystemConfigModel.deleteOne({ _id: new ObjectId(id) });
    }
    async deleteByConfSelect(confSelect: string): Promise<any> {
        return this.SystemConfigModel.deleteOne({ confSelect });
    }
    async create(systemConfig: SystemConfig, req: any): Promise<SystemConfig> {
        systemConfig.updateUser = req?.user?.userName;
        systemConfig.updateDate = new Date();
        systemConfig.addUser = req?.user?.userName;
        systemConfig.addDate = new Date();
        if (systemConfig.confValue !== "" && systemConfig.confValue != undefined) {
            systemConfig.isSet = true;
        } else {
            systemConfig.isSet = false;
        }
        const old = await this.SystemConfigModel.findOne({ confSelect: systemConfig.confSelect });
        if (old) {
            throw Error("配置已存在");
        }
        return new this.SystemConfigModel(systemConfig).save();
    }
    async update(systemConfig: SystemConfig, confSelect: string, req: any): Promise<any> {
        systemConfig.updateUser = req?.user?.userName;
        systemConfig.updateDate = new Date();
        const old = await this.SystemConfigModel.findOne({ confSelect });
        delete systemConfig.addDate;
        delete systemConfig.addUser;
        delete systemConfig.confSelect;
        delete systemConfig.confType;
        // delete systemConfig.isOpen;
        // delete systemConfig.allowFetch;
        if (old.isSet && !old.allowFetch && (systemConfig.confValue === "" || systemConfig.confValue === undefined)) {
            // 已经设置了，且只可设置的项目，空参数时值不做改变
            delete systemConfig.confValue;
            delete systemConfig.updateUser;
            delete systemConfig.updateDate;
        } else if (systemConfig.confValue !== "" && systemConfig.confValue != undefined) {
            systemConfig.isSet = true;
        } else {
            systemConfig.isSet = false;
        }
        return await this.SystemConfigModel.updateOne({ confSelect: confSelect }, { $set: { ...systemConfig } });
    }
    async getAll(isOpen: boolean = false): Promise<SystemConfig[]> {
        const map: any = {};
        if (isOpen) {
            map.isOpen = true;
        }
        return (await this.SystemConfigModel.find(map)).map(item => {
            if (!item.allowFetch) {
                item.confValue = "";
            }
            return item;
        });
    }
    async getDetailById(id: string): Promise<SystemConfig> {
        let map: any = { _id: new ObjectId(id) }
        return await this.SystemConfigModel.findOne(map);
    }
    async getDetailByConfSelect(confSelect: string): Promise<SystemConfig> {
        let map: any = { confSelect: confSelect }
        return await this.SystemConfigModel.findOne(map);
    }
    // 通过配置类型，获取配置对象{confCode:confValue}
    async getConfigObjByConfType(confType: string): Promise<any> {
        const configList = await this.SystemConfigModel.find({ confType: confType });
        const config: any = {};
        if (configList.length > 0) {
            configList.forEach(c => {
                config[c.confSelect] = c.confValue;
            })
        }
        return config;
    }
    async getValueByConfSelect(confSelect: string, session?: any): Promise<string> {
        let map: any = { confSelect: confSelect };
        if (session) {
            const config = await this.SystemConfigModel.findOne(map).session(session);
            return config?.confValue;
        } else {
            const config = await this.SystemConfigModel.findOne(map);
            return config?.confValue;
        }

    }
    async getDetailByConfType(confType: string): Promise<SystemConfig[]> {
        let map: any = { confType: confType }
        return await this.SystemConfigModel.find(map);
    }
    /**
     * 获取参数配置页面配置信息
     * @returns 页面json配置信息
     */
    async getSystemPageConfig(): Promise<String> {
        return await this.getValueByConfSelect(SYSTEM_PAGE_CONFIG);
    }
    /**
     * 更新页面配置信息
     * @param value 新配置
     * @returns 
     */
    async updateSystemPageConfig(confValue: string): Promise<any> {
        return await this.SystemConfigModel.updateOne({ confSelect: SYSTEM_PAGE_CONFIG }, { confValue })
    }
}

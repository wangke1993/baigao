
/**
* 业务参数配置
*/
import axios from 'axios';
import type { SystemConfigDto } from './dto/SystemConfigDto';


/**
* createBindSystemConfig:创建业务参数配置绑定
* 
* @returns 
*/
export const SystemConfigControllerCreate = (data: SystemConfigDto, config?: any) => {
   return axios.post(`/api/systemConfig/create`, data, config);
}
/**
* updateSystemConfig:编辑业务参数配置绑定,data只传confValue即可
* confSelect：confSelect;
* @returns 
*/
export const SystemConfigControllerUpdate = (confSelect: string,data: SystemConfigDto, config?: any) => {
   return axios.post(`/api/systemConfig/update/${confSelect}`, data, config);
}
/**
* deleteSystemConfig:删除业务参数配置绑定
* confSelect：confSelect;
* @returns 
*/
export const SystemConfigControllerDelete = (confSelect: string, config?: any) => {
   return axios.delete(`/api/systemConfig/delete/${confSelect}`, config);
}
             
/**
* getAllSystemConfig:获取所有配置信息
* 
* @returns 
*/
export const SystemConfigControllerGetAll = ( config?: any) => {
   return axios.get(`/api/systemConfig/getAll`, { ...config });
}
/**
* 获取所有对外开放的配置信息
* 
* @returns 
*/
export const SystemConfigControllerGetOpenAll = ( config?: any) => {
   return axios.get(`/api/systemConfig/getOpenAll`, { ...config });
}
/**
* getSystemConfigDetail: 根据字典code获取系统配置详情,多个code用逗号隔开
* code：code;
* @returns 
*/
export const SystemConfigControllerGetSystemConfigDetail = (code: string, config?: any) => {
   return axios.get(`/api/systemConfig/getSystemConfigDetail/${code}`, { ...config });
}
/**
* getSystemPageConfig:获取【参数配置】页面配置信息
* 
* @returns 
*/
export const SystemConfigControllerGetSystemPageConfig = ( config?: any) => {
   return axios.get(`/api/systemConfig/getSystemPageConfig`, { ...config });
}
/**
* updateSystemPageConfig:更新【参数配置】页面配置信息
* 
* @returns 
*/
export const SystemConfigControllerUpdateSystemPageConfig = (data: SystemConfigDto, config?: any) => {
   return axios.post(`/api/systemConfig/updateSystemPageConfig`, data, config);
}

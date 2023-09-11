
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
* id：id;
* @returns 
*/
export const SystemConfigControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/systemConfig/delete/${id}`, config);
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
* 获取【参数配置】页面配置信息
* 
* @returns 
*/
export const SystemConfigControllerGetSystemPageConfig = ( config?: any) => {
   return axios.get(`/api/systemConfig/getSystemPageConfig`, { ...config });
}
/**
* 更新【参数配置】页面配置信息
* 
* @returns 
*/
export const SystemConfigControllerUpdateSystemPageConfig = (data: SystemConfigDto, config?: any) => {
   return axios.post(`/api/systemConfig/updateSystemPageConfig`, data, config);
}

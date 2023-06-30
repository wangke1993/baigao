
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
export const SystemConfigControllerUpdate = (confSelect: String,data: SystemConfigDto, config?: any) => {
   return axios.post(`/api/systemConfig/update/${confSelect}`, data, config);
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


/**
* 业务参数配置
*/
import {post,get,del} from '@/utils/request.js';
// SystemConfigDto：./dto/SystemConfigDto';


/**
* createBindSystemConfig:创建业务参数配置绑定
* 
* @returns 
*/
export function SystemConfigControllerCreate(SystemConfigDto){
   return post(`/systemConfig/create`, SystemConfigDto);
}
/**
* updateSystemConfig:编辑业务参数配置绑定,data只传confValue即可
* confSelect：confSelect;
* @returns 
*/
export function SystemConfigControllerUpdate(confSelect,SystemConfigDto){
   return post(`/systemConfig/update/${confSelect}`, SystemConfigDto);
}
/**
* getAllSystemConfig:获取所有配置信息
* 
* @returns 
*/
export function SystemConfigControllerGetAll(){
	// query:{} 
   return get(`/systemConfig/getAll`, {});
}
/**
* 获取所有对外开放的配置信息
* 
* @returns 
*/
export function SystemConfigControllerGetOpenAll(){
	// query:{} 
   return get(`/systemConfig/getOpenAll`, {});
}


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
* deleteSystemConfig:删除业务参数配置绑定
* confSelect：confSelect;
* @returns 
*/
export function SystemConfigControllerDelete(confSelect ){
   return del(`/systemConfig/delete/${confSelect}`);
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
/**
* getSystemConfigDetail: 根据字典code获取系统配置详情,多个code用逗号隔开
* code：code;
* @returns 
*/
export function SystemConfigControllerGetSystemConfigDetail(code){
	// query:{} 
   return get(`/systemConfig/getSystemConfigDetail/${code}`, {});
}
/**
* getSystemPageConfig:获取【参数配置】页面配置信息
* 
* @returns 
*/
export function SystemConfigControllerGetSystemPageConfig(){
	// query:{} 
   return get(`/systemConfig/getSystemPageConfig`, {});
}
/**
* updateSystemPageConfig:更新【参数配置】页面配置信息
* 
* @returns 
*/
export function SystemConfigControllerUpdateSystemPageConfig(SystemConfigDto){
   return post(`/systemConfig/updateSystemPageConfig`, SystemConfigDto);
}

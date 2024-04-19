
/**
* 开发工具
*/
import {post,get,del} from '@/utils/request.js';
// ModuleConfDto：./dto/ModuleConfDto';
// ModuleFieldDto：./dto/ModuleFieldDto';
// ModuleSearchDto：./dto/ModuleSearchDto';
// CreateCodeConfDtoDto：./dto/CreateCodeConfDtoDto';


/**
* DevCreateModule:新增模型
* 
* @returns 
*/
export function SystemDevControllerCreateModule(ModuleConfDto){
   return post(`/systemDev/DevCreateModule`, ModuleConfDto);
}
/**
* DevCreateModuleField:新增模型字段
* 
* @returns 
*/
export function SystemDevControllerCreateModuleField(ModuleFieldDto){
   return post(`/systemDev/DevCreateModuleField`, ModuleFieldDto);
}
/**
* 新增模型搜索配置
* 
* @returns 
*/
export function SystemDevControllerCreateModuleSearch(ModuleSearchDto){
   return post(`/systemDev/DevCreateModuleSearch`, ModuleSearchDto);
}
/**
* DevUpdateModule:更新模型
* UUID：UUID;
* @returns 
*/
export function SystemDevControllerDevUpdateModule(UUID,ModuleConfDto){
   return post(`/systemDev/DevUpdateModule/${UUID}`, ModuleConfDto);
}
/**
* 更新模型字段
* UUID：UUID;
* @returns 
*/
export function SystemDevControllerDevUpdateModuleField(UUID,ModuleFieldDto){
   return post(`/systemDev/DevUpdateModuleField/${UUID}`, ModuleFieldDto);
}
/**
* 更新模型搜索配置
* id：id;
* @returns 
*/
export function SystemDevControllerDevUpdateModuleSearch(id,ModuleSearchDto){
   return post(`/systemDev/DevUpdateModuleSearch/${id}`, ModuleSearchDto);
}
/**
* 删除模型
* id：id;
* @returns 
*/
export function SystemDevControllerDeleteModule(id ){
   return del(`/systemDev/DeleteModule/${id}`);
}
             
/**
* 删除模型字段
* id：id;
* @returns 
*/
export function SystemDevControllerDeleteModuleField(id ){
   return del(`/systemDev/DeleteModuleField/${id}`);
}
             
/**
* 删除模型搜索配置
* id：id;
* @returns 
*/
export function SystemDevControllerDeleteModuleSearch(id ){
   return del(`/systemDev/DeleteModuleSearch/${id}`);
}
             
/**
* 获取模型列表
* keyWord：undefined;
* @returns 
*/
export function SystemDevControllerGetModuleList(query){
	// query:{keyWord} 
   return get(`/systemDev/getModuleList`, query);
}
/**
* 获取模型字段列表
* keyWord：undefined;moduleUUID：moduleUUID;
* @returns 
*/
export function SystemDevControllerGetModuleFieldList(moduleUUID,query){
	// query:{keyWord} 
   return get(`/systemDev/getModuleFieldList/${moduleUUID}`, query);
}
/**
* 获取模型搜索列表
* moduleUUID：moduleUUID;
* @returns 
*/
export function SystemDevControllerGetModuleSearchList(moduleUUID){
	// query:{} 
   return get(`/systemDev/getModuleSearchList/${moduleUUID}`, {});
}
/**
* 生成代码
* UUID：UUID;
* @returns 
*/
export function SystemDevControllerCreateCode(UUID,CreateCodeConfDtoDto){
   return post(`/systemDev/createCode/${UUID}`, CreateCodeConfDtoDto);
}
/**
* 挂载菜单
* UUID：UUID;
* @returns 
*/
export function SystemDevControllerCreateMenu(UUID){
   return post(`/systemDev/createMenu/${UUID}`, {});
}
/**
* 中文翻译成英文
* keyWord：undefined;
* @returns 
*/
export function SystemDevControllerTranslateZhToEn(query){
	// query:{keyWord} 
   return get(`/systemDev/translateZhToEn`, query);
}

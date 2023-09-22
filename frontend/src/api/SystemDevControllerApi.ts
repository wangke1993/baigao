
/**
* 开发工具
*/
import axios from 'axios';
import type { ModuleConfDto } from './dto/ModuleConfDto';
import type { ModuleFieldDto } from './dto/ModuleFieldDto';
import type { ModuleSearchDto } from './dto/ModuleSearchDto';


/**
* DevCreateModule:新增模型
* 
* @returns 
*/
export const SystemDevControllerCreateModule = (data: ModuleConfDto, config?: any) => {
   return axios.post(`/api/systemDev/DevCreateModule`, data, config);
}
/**
* DevCreateModuleField:新增模型字段
* 
* @returns 
*/
export const SystemDevControllerCreateModuleField = (data: ModuleFieldDto, config?: any) => {
   return axios.post(`/api/systemDev/DevCreateModuleField`, data, config);
}
/**
* 新增模型搜索配置
* 
* @returns 
*/
export const SystemDevControllerCreateModuleSearch = (data: ModuleSearchDto, config?: any) => {
   return axios.post(`/api/systemDev/DevCreateModuleSearch`, data, config);
}
/**
* DevUpdateModule:更新模型
* UUID：UUID;
* @returns 
*/
export const SystemDevControllerDevUpdateModule = (UUID: string,data: ModuleConfDto, config?: any) => {
   return axios.post(`/api/systemDev/DevUpdateModule/${UUID}`, data, config);
}
/**
* DevUpdateModuleField:更新模型字段
* UUID：UUID;
* @returns 
*/
export const SystemDevControllerDevUpdateModuleField = (UUID: string,data: ModuleFieldDto, config?: any) => {
   return axios.post(`/api/systemDev/DevUpdateModuleField/${UUID}`, data, config);
}
/**
* 新增模型搜索配置
* UUID：UUID;
* @returns 
*/
export const SystemDevControllerDevUpdateModuleSearch = (UUID: string,data: ModuleSearchDto, config?: any) => {
   return axios.post(`/api/systemDev/DevUpdateModuleSearch/${UUID}`, data, config);
}
/**
* 删除模型
* id：id;
* @returns 
*/
export const SystemDevControllerDeleteModule = (id: string, config?: any) => {
   return axios.delete(`/api/systemDev/DeleteModule/${id}`, config);
}
             
/**
* 删除模型字段
* id：id;
* @returns 
*/
export const SystemDevControllerDeleteModuleField = (id: string, config?: any) => {
   return axios.delete(`/api/systemDev/DeleteModuleField/${id}`, config);
}
             
/**
* 删除模型搜索配置
* id：id;
* @returns 
*/
export const SystemDevControllerDeleteModuleSearch = (id: string, config?: any) => {
   return axios.delete(`/api/systemDev/DeleteModuleSearch/${id}`, config);
}
             
/**
* 获取模型列表
* keyWord：undefined;
* @returns 
*/
export const SystemDevControllerGetModuleList = (query: { keyWord: string }, config?: any) => {
   return axios.get(`/api/systemDev/getModuleList`, { params: query,...config });
}
/**
* 获取模型列表
* keyWord：undefined;
* @returns 
*/
export const SystemDevControllerGetModuleFieldList = (query: { keyWord: string }, config?: any) => {
   return axios.get(`/api/systemDev/getModuleFieldList`, { params: query,...config });
}
/**
* 获取模型列表
* 
* @returns 
*/
export const SystemDevControllerGetModuleSearchList = ( config?: any) => {
   return axios.get(`/api/systemDev/getModuleSearchList`, { ...config });
}
/**
* 生成代码
* 
* @returns 
*/
export const SystemDevControllerGetPath = ( config?: any) => {
   return axios.get(`/api/systemDev/createCode`, { ...config });
}

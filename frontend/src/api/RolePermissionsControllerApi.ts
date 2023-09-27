
/**
* 角色权限
*/
import axios from 'axios';
import type { RolePermissionsDto } from './dto/RolePermissionsDto';


/**
* createRole:创建角色权限
* 
* @returns 
*/
export const RolePermissionsControllerCreate = (data: RolePermissionsDto, config?: any) => {
   return axios.post(`/api/rolePermissions/create`, data, config);
}
/**
* updateRole:修改角色权限
* id：id;
* @returns 
*/
export const RolePermissionsControllerUpdate = (id: string,data: RolePermissionsDto, config?: any) => {
   return axios.post(`/api/rolePermissions/update/${id}`, data, config);
}
/**
* deleteRole:删除角色权限
* id：id;
* @returns 
*/
export const RolePermissionsControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/rolePermissions/delete/${id}`, config);
}
             
/**
* getRolePage:获取角色权限分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export const RolePermissionsControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string }, config?: any) => {
   return axios.get(`/api/rolePermissions/getPage`, { params: query,...config });
}
/**
* getRoleList:获取角色权限列表
* 
* @returns 
*/
export const RolePermissionsControllerGetList = ( config?: any) => {
   return axios.get(`/api/rolePermissions/getList`, { ...config });
}

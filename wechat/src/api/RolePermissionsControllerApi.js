
/**
* 角色权限
*/
import {post,get,del} from '@/utils/request.js';
// RolePermissionsDto：./dto/RolePermissionsDto';


/**
* createRole:创建角色权限
* 
* @returns 
*/
export function RolePermissionsControllerCreate(RolePermissionsDto){
   return post(`/rolePermissions/create`, RolePermissionsDto);
}
/**
* updateRole:修改角色权限
* id：id;
* @returns 
*/
export function RolePermissionsControllerUpdate(id,RolePermissionsDto){
   return post(`/rolePermissions/update/${id}`, RolePermissionsDto);
}
/**
* deleteRole:删除角色权限
* id：id;
* @returns 
*/
export function RolePermissionsControllerDelete(id ){
   return del(`/rolePermissions/delete/${id}`);
}
             
/**
* getRolePage:获取角色权限分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export function RolePermissionsControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord} 
   return get(`/rolePermissions/getPage`, query);
}
/**
* getRoleList:获取角色权限列表
* 
* @returns 
*/
export function RolePermissionsControllerGetList(){
	// query:{} 
   return get(`/rolePermissions/getList`, {});
}

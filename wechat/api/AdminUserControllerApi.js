
/**
* 后台用户管理
*/
import {post,get,del} from '@/utils/request.js';
// AdminUserDto：./dto/AdminUserDto';
// UpdatePasswordDtoDto：./dto/UpdatePasswordDtoDto';


/**
* createAdminUser:创建后台用户
* 
* @returns 
*/
export function AdminUserControllerCreate(AdminUserDto){
   return post(`/adminUser/create`, AdminUserDto);
}
/**
* updateAdminUser:更新后台用户信息
* id：id;
* @returns 
*/
export function AdminUserControllerUpdate(id,AdminUserDto){
   return post(`/adminUser/update/${id}`, AdminUserDto);
}
/**
* updateAdminUserPassword:后台用户密码修改
* id：id;
* @returns 
*/
export function AdminUserControllerUpdatePassword(id,UpdatePasswordDtoDto){
   return post(`/adminUser/updatePassword/${id}`, UpdatePasswordDtoDto);
}
/**
* resetAdminUserPassword:后台用户密码重置
* id：id;
* @returns 
*/
export function AdminUserControllerResetPassword(id){
   return post(`/adminUser/resetPassword/${id}`, {});
}
/**
* deleteAdminUser:删除后台用户
* id：id;
* @returns 
*/
export function AdminUserControllerDelete(id ){
   return del(`/adminUser/delete/${id}`);
}
             
/**
* getAdminUserPage:获取后台用户分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export function AdminUserControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord} 
   return get(`/adminUser/getPage`, query);
}

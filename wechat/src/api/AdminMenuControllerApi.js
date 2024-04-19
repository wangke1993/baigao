
/**
* 菜单管理
*/
import {post,get,del} from '@/utils/request.js';
// AdminMenuDto：./dto/AdminMenuDto';


/**
* createMenu：新增菜单
* 
* @returns 
*/
export function AdminMenuControllerCreate(AdminMenuDto){
   return post(`/admin/menu/create`, AdminMenuDto);
}
/**
* updateMenu：编辑菜单
* id：id;
* @returns 
*/
export function AdminMenuControllerUpdate(id,AdminMenuDto){
   return post(`/admin/menu/update/${id}`, AdminMenuDto);
}
/**
* getMenu：获取菜单树
* 
* @returns 
*/
export function AdminMenuControllerGetTree(){
	// query:{} 
   return get(`/admin/menu/getMenu`, {});
}
/**
* getTreeByMenuType：根据菜单资源属性获取菜单树
* menuType：menuType;
* @returns 
*/
export function AdminMenuControllerGetTreeByMenuType(menuType){
	// query:{} 
   return get(`/admin/menu/getMenu/${menuType}`, {});
}
/**
* deleteMenu：删除菜单
* id：id;
* @returns 
*/
export function AdminMenuControllerDelete(id ){
   return del(`/admin/menu/delete/${id}`);
}
             
/**
* changeMenuParent:移动菜单
* id：id;pId：pId;
* @returns 
*/
export function AdminMenuControllerChangeParent(id,pId){
   return post(`/admin/menu/changeParent/${id}/${pId}`, {});
}

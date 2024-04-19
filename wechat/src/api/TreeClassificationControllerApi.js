
/**
* 树形分类管理
*/
import {post,get,del} from '@/utils/request.js';
// TreeClassificationDto：./dto/TreeClassificationDto';


/**
* createTreeClassification:新增树形分类
* 
* @returns 
*/
export function TreeClassificationControllerCreate(TreeClassificationDto){
   return post(`/treeClassification/Create`, TreeClassificationDto);
}
/**
* updateTreeClassification：编辑树形分类管理
* id：id;
* @returns 
*/
export function TreeClassificationControllerUpdate(id,TreeClassificationDto){
   return post(`/treeClassification/Update/${id}`, TreeClassificationDto);
}
/**
* deleteTreeClassification:删除树形分类
* id：id;
* @returns 
*/
export function TreeClassificationControllerDelete(id ){
   return del(`/treeClassification/Delete/${id}`);
}
             
/**
* getTreeClassificationTree:获取树形分类管理树
* dataClass：dataClass;keyWord：undefined;
* @returns 
*/
export function TreeClassificationControllerGetTree(dataClass,query){
	// query:{keyWord} 
   return get(`/treeClassification/getTree/${dataClass}`, query);
}
/**
* 获取开放的树形分类管理树
* dataClass：dataClass;keyWord：undefined;
* @returns 
*/
export function TreeClassificationControllerGetOpenTree(dataClass,query){
	// query:{keyWord} 
   return get(`/treeClassification/getOpenTree/${dataClass}`, query);
}
/**
* moveTreeClassification:移动树形;direction==1上移,direction==-1下移
* direction：direction;
* @returns 
*/
export function TreeClassificationControllerMove(direction,TreeClassificationDto){
   return post(`/treeClassification/move/${direction}`, TreeClassificationDto);
}
/**
* getTreeLastList:获取末级分类
* dataClass：dataClass;
* @returns 
*/
export function TreeClassificationControllerGetLastList(dataClass){
   return post(`/treeClassification/getLastList/${dataClass}`, {});
}
/**
* getTreeFirstList:获取一级分类
* dataClass：dataClass;
* @returns 
*/
export function TreeClassificationControllerGetFirstList(dataClass){
   return post(`/treeClassification/getFirstList/${dataClass}`, {});
}

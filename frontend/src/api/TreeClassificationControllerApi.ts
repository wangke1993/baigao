
/**
* 树形分类管理
*/
import axios from 'axios';
import type { TreeClassificationDto } from './dto/TreeClassificationDto';


/**
* createTreeClassification:新增树形分类
* 
* @returns 
*/
export const TreeClassificationControllerCreate = (data: TreeClassificationDto, config?: any) => {
   return axios.post(`/api/treeClassification/Create`, data, config);
}
/**
* updateTreeClassification：编辑树形分类管理
* id：id;
* @returns 
*/
export const TreeClassificationControllerUpdate = (id: string,data: TreeClassificationDto, config?: any) => {
   return axios.post(`/api/treeClassification/Update/${id}`, data, config);
}
/**
* deleteTreeClassification:删除树形分类
* id：id;
* @returns 
*/
export const TreeClassificationControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/treeClassification/Delete/${id}`, config);
}
             
/**
* getTreeClassificationTree:获取树形分类管理树
* dataClass：dataClass;keyWord：undefined;
* @returns 
*/
export const TreeClassificationControllerGetTree = (dataClass: string,query: { keyWord: string }, config?: any) => {
   return axios.get(`/api/treeClassification/getTree/${dataClass}`, { params: query,...config });
}
/**
* moveTreeClassification:移动树形;direction==1上移,direction==-1下移
* direction：direction;
* @returns 
*/
export const TreeClassificationControllerMove = (direction: number,data: TreeClassificationDto, config?: any) => {
   return axios.post(`/api/treeClassification/move/${direction}`, data, config);
}
/**
* getTreeLastList:获取末级分类
* dataClass：dataClass;
* @returns 
*/
export const TreeClassificationControllerGetLastList = (dataClass: string, config?: any) => {
   return axios.post(`/api/treeClassification/getLastList/${dataClass}`, {}, config);
}

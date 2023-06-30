
/**
* 数据字典
*/
import {post,get,del} from '@/utils/request.js';
// DataDictionaryDto：./dto/DataDictionaryDto';


/**
* createDic:新增字典,dicType等于1时添加分类等于2时添加字典值
* 
* @returns 
*/
export function DataDictionaryControllerCreate(DataDictionaryDto){
   return post(`/admin/dic/create`, DataDictionaryDto);
}
/**
* updateDic：编辑数据字典
* id：id;
* @returns 
*/
export function DataDictionaryControllerUpdate(id,DataDictionaryDto){
   return post(`/admin/dic/update/${id}`, DataDictionaryDto);
}
/**
* 根据字典分类(分类dicCode)获取字典值,无需权限校验
* dicClass：dicClass;
* @returns 
*/
export function DataDictionaryControllerGetListByDicClass(dicClass){
	// query:{} 
   return get(`/admin/dic/getList/${dicClass}`, {});
}
/**
* deleteDic:删除字典
* dicCode：dicCode;
* @returns 
*/
export function DataDictionaryControllerDelete(dicCode ){
   return del(`/admin/dic/delete/${dicCode}`);
}
             
/**
* getDicPage:获取数据字典分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;dicClass：所属数据字典(dicCode)，为空时查询字典类型分页，有值时，查询字典分类下的字典值;
* @returns 
*/
export function DataDictionaryControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,dicClass} 
   return get(`/admin/dic/getPage`, query);
}

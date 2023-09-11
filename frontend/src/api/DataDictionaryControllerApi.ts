
/**
* 数据字典
*/
import axios from 'axios';
import type { DataDictionaryDto } from './dto/DataDictionaryDto';


/**
* createDic:新增字典,dicType等于1时添加分类等于2时添加字典值
* 
* @returns 
*/
export const DataDictionaryControllerCreate = (data: DataDictionaryDto, config?: any) => {
   return axios.post(`/api/admin/dic/create`, data, config);
}
/**
* updateDic：编辑数据字典
* id：id;
* @returns 
*/
export const DataDictionaryControllerUpdate = (id: string,data: DataDictionaryDto, config?: any) => {
   return axios.post(`/api/admin/dic/update/${id}`, data, config);
}
/**
* 根据字典分类(分类dicCode)获取字典值,无需权限校验
* dicClass：dicClass;
* @returns 
*/
export const DataDictionaryControllerGetListByDicClass = (dicClass: string, config?: any) => {
   return axios.get(`/api/admin/dic/getList/${dicClass}`, { ...config });
}
/**
* deleteDic:删除字典
* dicCode：dicCode;
* @returns 
*/
export const DataDictionaryControllerDelete = (dicCode: string, config?: any) => {
   return axios.delete(`/api/admin/dic/delete/${dicCode}`, config);
}
             
/**
* getDicPage:获取数据字典分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;dicClass：所属数据字典(dicCode)，为空时查询字典类型分页，有值时，查询字典分类下的字典值;
* @returns 
*/
export const DataDictionaryControllerGetPage = (query: { pageSize: sring,pageIndex: sring,keyWord: string,dicClass: string }, config?: any) => {
   return axios.get(`/api/admin/dic/getPage`, { params: query,...config });
}

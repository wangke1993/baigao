
/**
* 广告管理
*/
import axios from 'axios';
import type { AdMangerDto } from './dto/AdMangerDto';


/**
* createAd:创建广告
* 
* @returns 
*/
export const AdMangerControllerCreate = (data: AdMangerDto, config?: any) => {
   return axios.post(`/api/rotation/create`, data, config);
}
/**
* updateAd:编辑广告
* id：id;
* @returns 
*/
export const AdMangerControllerUpdate = (id: string,data: AdMangerDto, config?: any) => {
   return axios.post(`/api/rotation/update/${id}`, data, config);
}
/**
* deleteAd:删除广告
* id：id;
* @returns 
*/
export const AdMangerControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/rotation/delete/${id}`, config);
}
             
/**
* getAdPage:获取广告分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;position：广告位置，取字典管理中：DC0002的值;isRelease：发布状态，0全部，1已发布，2未发布;
* @returns 
*/
export const AdMangerControllerGetPage = (query: { pageSize: string,pageIndex: string,keyWord: string,position: string,isRelease: string }, config?: any) => {
   return axios.get(`/api/rotation/getPage`, { params: query,...config });
}
/**
* 获取已发布的广告列表，无需登录
* 
* @returns 
*/
export const AdMangerControllerGetList = ( config?: any) => {
   return axios.get(`/api/rotation/getList`, { ...config });
}

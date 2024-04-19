
/**
* 钱包流水
*/
import axios from 'axios';
import type { WalletLogDto } from './dto/WalletLogDto';
import type { WalletLogDto } from './dto/WalletLogDto';


/**
* createWalletLog:创建钱包流水
* 
* @returns 
*/
export const WalletLogControllerCreate = (data: WalletLogDto, config?: any) => {
   return axios.post(`/api/walletLog/create`, data, config);
}
/**
* updateWalletLog:编辑钱包流水
* id：id;
* @returns 
*/
export const WalletLogControllerUpdate = (id: string,data: WalletLogDto, config?: any) => {
   return axios.post(`/api/walletLog/update/${id}`, data, config);
}
/**
* deleteWalletLog:删除钱包流水
* id：id;
* @returns 
*/
export const WalletLogControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/walletLog/delete/${id}`, config);
}
             
/**
* getWalletLogById:根据id获取钱包流水详情
* id：id;
* @returns 
*/
export const WalletLogControllerGetDetailById = (id: string, config?: any) => {
   return axios.get(`/api/walletLog/getDetail/${id}`, { ...config });
}
/**
* getWalletLogPage:获取钱包流水分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;walletUUID：所属钱包;logType：流向: 1收入,-1支出;
* @returns 
*/
export const WalletLogControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string,walletUUID: string,logType: string }, config?: any) => {
   return axios.get(`/api/walletLog/getPage`, { params: query,...config });
}

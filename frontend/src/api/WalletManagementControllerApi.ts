
/**
* 钱包管理
*/
import axios from 'axios';
import type { WalletManagementDto } from './dto/WalletManagementDto';
import type { WalletLogDto } from './dto/WalletLogDto';


/**
* createWalletManagement:创建钱包管理
* 
* @returns 
*/
export const WalletManagementControllerCreate = (data: WalletManagementDto, config?: any) => {
   return axios.post(`/api/walletManagement/create`, data, config);
}
/**
* updateWalletManagement:编辑钱包管理
* id：id;
* @returns 
*/
export const WalletManagementControllerUpdate = (id: string,data: WalletManagementDto, config?: any) => {
   return axios.post(`/api/walletManagement/update/${id}`, data, config);
}
/**
* deleteWalletManagement:删除钱包管理
* id：id;
* @returns 
*/
export const WalletManagementControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/walletManagement/delete/${id}`, config);
}
             
/**
* getWalletManagementById:根据id获取钱包管理详情
* id：id;
* @returns 
*/
export const WalletManagementControllerGetDetailById = (id: string, config?: any) => {
   return axios.get(`/api/walletManagement/getDetail/${id}`, { ...config });
}
/**
* getDetailByBindUserUUID:根据BindUserUUID获取钱包管理详情
* bindUserUUID：bindUserUUID;
* @returns 
*/
export const WalletManagementControllerGetDetailByBindUserUUID = (bindUserUUID: string, config?: any) => {
   return axios.get(`/api/walletManagement/getDetailByBindUserUUID/${bindUserUUID}`, { ...config });
}
/**
* getWalletManagementPage:获取钱包管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export const WalletManagementControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string }, config?: any) => {
   return axios.get(`/api/walletManagement/getPage`, { params: query,...config });
}
/**
* changeInWalletAmount:钱包金额变动
* bindUserUUID：bindUserUUID;
* @returns 
*/
export const WalletManagementControllerChangeInAmount = (bindUserUUID: string,data: WalletLogDto, config?: any) => {
   return axios.post(`/api/walletManagement/changeInWalletAmount/${bindUserUUID}`, data, config);
}
/**
* freezeThawWallet:冻结解冻钱包
* bindUserUUID：bindUserUUID;
* @returns 
*/
export const WalletManagementControllerFreezeThaw = (bindUserUUID: string, config?: any) => {
   return axios.post(`/api/walletManagement/freezeThawWallet/${bindUserUUID}`, {}, config);
}

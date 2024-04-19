
/**
* 提现管理
*/
import axios from 'axios';
import type { WithdrawalRefuseDto } from './dto/WithdrawalRefuseDto';


/**
* deleteWithdrawalManagement:删除提现管理
* id：id;
* @returns 
*/
export const WithdrawalManagementControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/withdrawalManagement/delete/${id}`, config);
}
             
/**
* getWithdrawalManagementById:根据id获取提现管理详情
* id：id;
* @returns 
*/
export const WithdrawalManagementControllerGetDetailById = (id: string, config?: any) => {
   return axios.get(`/api/withdrawalManagement/getDetail/${id}`, { ...config });
}
/**
* getWithdrawalManagementPage:获取提现管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;status：审核状态;withdrawal：提现类型;walletUUID：提现钱包;
* @returns 
*/
export const WithdrawalManagementControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string,status: string,withdrawal: string,walletUUID: string }, config?: any) => {
   return axios.get(`/api/withdrawalManagement/getPage`, { params: query,...config });
}
/**
* getWithdrawalManagementPageByWeChat:微信小程序获取提现管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;status：审核状态;withdrawal：提现类型;walletUUID：提现钱包;
* @returns 
*/
export const WithdrawalManagementControllerGetPageByWeChat = (query: { pageSize: number,pageIndex: number,keyWord: string,status: string,withdrawal: string,walletUUID: string }, config?: any) => {
   return axios.get(`/api/withdrawalManagement/getPageByWeChat`, { params: query,...config });
}
/**
* walletWithdrawalApplication:钱包提现申请
* userPort：userPort;money：money;
* @returns 
*/
export const WithdrawalManagementControllerWalletWithdrawalApplication = (userPort: string,money: number, config?: any) => {
   return axios.post(`/api/withdrawalManagement/application/${userPort}/${money}`, {}, config);
}
/**
* withdrawalApplicationApproved:钱包提现申请通过
* id：id;
* @returns 
*/
export const WithdrawalManagementControllerApproved = (id: string, config?: any) => {
   return axios.post(`/api/withdrawalManagement/approved/${id}`, {}, config);
}
/**
* walletWithdrawalApplicationRefuse:拒绝钱包提现申请
* 
* @returns 
*/
export const WithdrawalManagementControllerRefuse = (data: WithdrawalRefuseDto, config?: any) => {
   return axios.post(`/api/withdrawalManagement/refuse`, data, config);
}

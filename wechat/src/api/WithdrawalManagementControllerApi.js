
/**
* 提现管理
*/
import {post,get,del} from '@/utils/request.js';
// WithdrawalRefuseDtoDto：./dto/WithdrawalRefuseDtoDto';


/**
* deleteWithdrawalManagement:删除提现管理
* id：id;
* @returns 
*/
export function WithdrawalManagementControllerDelete(id ){
   return del(`/withdrawalManagement/delete/${id}`);
}
             
/**
* getWithdrawalManagementById:根据id获取提现管理详情
* id：id;
* @returns 
*/
export function WithdrawalManagementControllerGetDetailById(id){
	// query:{} 
   return get(`/withdrawalManagement/getDetail/${id}`, {});
}
/**
* getWithdrawalManagementPage:获取提现管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;status：审核状态;withdrawal：提现类型;walletUUID：提现钱包;
* @returns 
*/
export function WithdrawalManagementControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,status,withdrawal,walletUUID} 
   return get(`/withdrawalManagement/getPage`, query);
}
/**
* getWithdrawalManagementPageByWeChat:微信小程序获取提现管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;status：审核状态;withdrawal：提现类型;walletUUID：提现钱包;
* @returns 
*/
export function WithdrawalManagementControllerGetPageByWeChat(query){
	// query:{pageSize,pageIndex,keyWord,status,withdrawal,walletUUID} 
   return get(`/withdrawalManagement/getPageByWeChat`, query);
}
/**
* walletWithdrawalApplication:钱包提现申请
* userPort：userPort;money：money;
* @returns 
*/
export function WithdrawalManagementControllerWalletWithdrawalApplication(userPort,money){
   return post(`/withdrawalManagement/application/${userPort}/${money}`, {});
}
/**
* withdrawalApplicationApproved:钱包提现申请通过
* id：id;
* @returns 
*/
export function WithdrawalManagementControllerApproved(id){
   return post(`/withdrawalManagement/approved/${id}`, {});
}
/**
* walletWithdrawalApplicationRefuse:拒绝钱包提现申请
* 
* @returns 
*/
export function WithdrawalManagementControllerRefuse(WithdrawalRefuseDtoDto){
   return post(`/withdrawalManagement/refuse`, WithdrawalRefuseDtoDto);
}

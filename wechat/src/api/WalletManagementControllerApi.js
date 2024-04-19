
/**
* 钱包管理
*/
import {post,get,del} from '@/utils/request.js';
// WalletManagementDto：./dto/WalletManagementDto';
// WalletLogDto：./dto/WalletLogDto';


/**
* createWalletManagement:创建钱包管理
* 
* @returns 
*/
export function WalletManagementControllerCreate(WalletManagementDto){
   return post(`/walletManagement/create`, WalletManagementDto);
}
/**
* updateWalletManagement:编辑钱包管理
* id：id;
* @returns 
*/
export function WalletManagementControllerUpdate(id,WalletManagementDto){
   return post(`/walletManagement/update/${id}`, WalletManagementDto);
}
/**
* deleteWalletManagement:删除钱包管理
* id：id;
* @returns 
*/
export function WalletManagementControllerDelete(id ){
   return del(`/walletManagement/delete/${id}`);
}
             
/**
* getWalletManagementById:根据id获取钱包管理详情
* id：id;
* @returns 
*/
export function WalletManagementControllerGetDetailById(id){
	// query:{} 
   return get(`/walletManagement/getDetail/${id}`, {});
}
/**
* getDetailByBindUserUUID:根据BindUserUUID获取钱包管理详情
* bindUserUUID：bindUserUUID;
* @returns 
*/
export function WalletManagementControllerGetDetailByBindUserUUID(bindUserUUID){
	// query:{} 
   return get(`/walletManagement/getDetailByBindUserUUID/${bindUserUUID}`, {});
}
/**
* getWalletManagementPage:获取钱包管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export function WalletManagementControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord} 
   return get(`/walletManagement/getPage`, query);
}
/**
* changeInWalletAmount:钱包金额变动
* bindUserUUID：bindUserUUID;
* @returns 
*/
export function WalletManagementControllerChangeInAmount(bindUserUUID,WalletLogDto){
   return post(`/walletManagement/changeInWalletAmount/${bindUserUUID}`, WalletLogDto);
}
/**
* freezeThawWallet:冻结解冻钱包
* bindUserUUID：bindUserUUID;
* @returns 
*/
export function WalletManagementControllerFreezeThaw(bindUserUUID){
   return post(`/walletManagement/freezeThawWallet/${bindUserUUID}`, {});
}

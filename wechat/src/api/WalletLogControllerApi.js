
/**
* 钱包流水
*/
import {post,get,del} from '@/utils/request.js';
// WalletLogDtoDto：./dto/WalletLogDtoDto';
// WalletLogDto：./dto/WalletLogDto';


/**
* createWalletLog:创建钱包流水
* 
* @returns 
*/
export function WalletLogControllerCreate(WalletLogDtoDto){
   return post(`/walletLog/create`, WalletLogDtoDto);
}
/**
* updateWalletLog:编辑钱包流水
* id：id;
* @returns 
*/
export function WalletLogControllerUpdate(id,WalletLogDto){
   return post(`/walletLog/update/${id}`, WalletLogDto);
}
/**
* deleteWalletLog:删除钱包流水
* id：id;
* @returns 
*/
export function WalletLogControllerDelete(id ){
   return del(`/walletLog/delete/${id}`);
}
             
/**
* getWalletLogById:根据id获取钱包流水详情
* id：id;
* @returns 
*/
export function WalletLogControllerGetDetailById(id){
	// query:{} 
   return get(`/walletLog/getDetail/${id}`, {});
}
/**
* getWalletLogPage:获取钱包流水分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;walletUUID：所属钱包;logType：流向: 1收入,-1支出;
* @returns 
*/
export function WalletLogControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,walletUUID,logType} 
   return get(`/walletLog/getPage`, query);
}

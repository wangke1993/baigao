
/**
* 会员管理
*/
import {post,get,del} from '@/utils/request.js';
// MemberManagementDto：./dto/MemberManagementDto';


/**
* getMemberPage:获取会员分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;memberRank：会员等级;
* @returns 
*/
export function MemberManagementControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,memberRank} 
   return get(`/member/getPage`, query);
}
/**
* onlineStatistics:在线统计
* 
* @returns 
*/
export function MemberManagementControllerOnlineStatistics(){
	// query:{} 
   return get(`/member/onlineStatistics`, {});
}
/**
* getMemberList:获取会员列表
* 
* @returns 
*/
export function MemberManagementControllerGetMemberList(){
	// query:{} 
   return get(`/member/getMemberList`, {});
}
/**
* getMemberWallet:获取会员钱包明细
* 
* @returns 
*/
export function MemberManagementControllerGetMemberWallet(){
	// query:{} 
   return get(`/member/getMemberWallet`, {});
}
/**
* getMemberWalletByManger:管理人员获取会员钱包明细
* memberUUID：memberUUID;
* @returns 
*/
export function MemberManagementControllerGetMemberWalletByManger(memberUUID){
	// query:{} 
   return get(`/member/getMemberWalletByManger/${memberUUID}`, {});
}
/**
* createMemberManagement:创建会员管理
* 
* @returns 
*/
export function MemberManagementControllerCreate(MemberManagementDto){
   return post(`/member/create`, MemberManagementDto);
}
/**
* updateMemberManagement:编辑会员管理
* id：id;
* @returns 
*/
export function MemberManagementControllerUpdate(id,MemberManagementDto){
   return post(`/member/update/${id}`, MemberManagementDto);
}
/**
* deleteMemberManagement:删除会员管理
* id：id;
* @returns 
*/
export function MemberManagementControllerDelete(id ){
   return del(`/member/delete/${id}`);
}
             
/**
* getMemberManagementById:根据id获取会员管理详情
* id：id;
* @returns 
*/
export function MemberManagementControllerGetDetailById(id){
	// query:{} 
   return get(`/member/getDetail/${id}`, {});
}
/**
* getMemberManagementByUUID:根据UUID获取会员管理详情
* UUID：UUID;
* @returns 
*/
export function MemberManagementControllerGetDetailByUUID(UUID){
	// query:{} 
   return get(`/member/getByUUID/${UUID}`, {});
}

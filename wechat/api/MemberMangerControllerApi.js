
/**
* 会员管理
*/
import {post,get,del} from '@/utils/request.js';
// AddrMangerDto：./dto/AddrMangerDto';


/**
* getMemberPage:获取会员分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;memberRank：会员等级;
* @returns 
*/
export function MemberMangerControllerGetMemberPage(query){
	// query:{pageSize,pageIndex,keyWord,memberRank} 
   return get(`/member/getMemberPage`, query);
}
/**
* getMemberDetail:获取会员详情
* memberUUID：memberUUID;
* @returns 
*/
export function MemberMangerControllerGetMemberDetail(memberUUID){
	// query:{} 
   return get(`/member/getMemberDetail/${memberUUID}`, {});
}
/**
* getAddrListByAdmin:管理员根据会员UUID获取会员地址信息列表
* memberUUID：memberUUID;
* @returns 
*/
export function MemberMangerControllerGetAddrListByAdmin(memberUUID){
	// query:{} 
   return get(`/member/getAddrListByAdmin/${memberUUID}`, {});
}
/**
* getAddrList:会员获取会员地址信息列表
* 
* @returns 
*/
export function MemberMangerControllerGetAddrList(){
	// query:{} 
   return get(`/member/getAddrList`, {});
}
/**
* createAddr:新增地址
* 
* @returns 
*/
export function MemberMangerControllerCreate(AddrMangerDto){
   return post(`/member/createAddr`, AddrMangerDto);
}
/**
* updateAddr:编辑会员地址
* id：id;
* @returns 
*/
export function MemberMangerControllerUpdate(id,AddrMangerDto){
   return post(`/member/updateAddr/${id}`, AddrMangerDto);
}
/**
* deleteAddr:删除会员地址
* id：id;
* @returns 
*/
export function MemberMangerControllerDeleteAddr(id ){
   return del(`/member/deleteAddr/${id}`);
}
             

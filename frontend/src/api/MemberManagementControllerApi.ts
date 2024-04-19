
/**
* 会员管理
*/
import axios from 'axios';
import type { MemberManagementDto } from './dto/MemberManagementDto';


/**
* getMemberPage:获取会员分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;memberRank：会员等级;
* @returns 
*/
export const MemberManagementControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string,memberRank: string }, config?: any) => {
   return axios.get(`/api/member/getPage`, { params: query,...config });
}
/**
* onlineStatistics:在线统计
* 
* @returns 
*/
export const MemberManagementControllerOnlineStatistics = ( config?: any) => {
   return axios.get(`/api/member/onlineStatistics`, { ...config });
}
/**
* getMemberList:获取会员列表
* 
* @returns 
*/
export const MemberManagementControllerGetMemberList = ( config?: any) => {
   return axios.get(`/api/member/getMemberList`, { ...config });
}
/**
* getMemberWallet:获取会员钱包明细
* 
* @returns 
*/
export const MemberManagementControllerGetMemberWallet = ( config?: any) => {
   return axios.get(`/api/member/getMemberWallet`, { ...config });
}
/**
* getMemberWalletByManger:管理人员获取会员钱包明细
* memberUUID：memberUUID;
* @returns 
*/
export const MemberManagementControllerGetMemberWalletByManger = (memberUUID: string, config?: any) => {
   return axios.get(`/api/member/getMemberWalletByManger/${memberUUID}`, { ...config });
}
/**
* createMemberManagement:创建会员管理
* 
* @returns 
*/
export const MemberManagementControllerCreate = (data: MemberManagementDto, config?: any) => {
   return axios.post(`/api/member/create`, data, config);
}
/**
* updateMemberManagement:编辑会员管理
* id：id;
* @returns 
*/
export const MemberManagementControllerUpdate = (id: string,data: MemberManagementDto, config?: any) => {
   return axios.post(`/api/member/update/${id}`, data, config);
}
/**
* deleteMemberManagement:删除会员管理
* id：id;
* @returns 
*/
export const MemberManagementControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/member/delete/${id}`, config);
}
             
/**
* getMemberManagementById:根据id获取会员管理详情
* id：id;
* @returns 
*/
export const MemberManagementControllerGetDetailById = (id: string, config?: any) => {
   return axios.get(`/api/member/getDetail/${id}`, { ...config });
}
/**
* getMemberManagementByUUID:根据UUID获取会员管理详情
* UUID：UUID;
* @returns 
*/
export const MemberManagementControllerGetDetailByUUID = (UUID: string, config?: any) => {
   return axios.get(`/api/member/getByUUID/${UUID}`, { ...config });
}

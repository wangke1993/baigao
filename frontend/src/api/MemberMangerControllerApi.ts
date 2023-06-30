
/**
* 会员管理
*/
import axios from 'axios';
import type { AddrMangerDto } from './dto/AddrMangerDto';


/**
* getMemberPage:获取会员分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;memberRank：会员等级;
* @returns 
*/
export const MemberMangerControllerGetMemberPage = (query: { pageSize: String,pageIndex: String,keyWord: String,memberRank: String }, config?: any) => {
   return axios.get(`/api/member/getMemberPage`, { params: query,...config });
}
/**
* getMemberDetail:获取会员详情
* memberUUID：memberUUID;
* @returns 
*/
export const MemberMangerControllerGetMemberDetail = (memberUUID: String, config?: any) => {
   return axios.get(`/api/member/getMemberDetail/${memberUUID}`, { ...config });
}
/**
* getAddrListByAdmin:管理员根据会员UUID获取会员地址信息列表
* memberUUID：memberUUID;
* @returns 
*/
export const MemberMangerControllerGetAddrListByAdmin = (memberUUID: String, config?: any) => {
   return axios.get(`/api/member/getAddrListByAdmin/${memberUUID}`, { ...config });
}
/**
* getAddrList:会员获取会员地址信息列表
* 
* @returns 
*/
export const MemberMangerControllerGetAddrList = ( config?: any) => {
   return axios.get(`/api/member/getAddrList`, { ...config });
}
/**
* createAddr:新增地址
* 
* @returns 
*/
export const MemberMangerControllerCreate = (data: AddrMangerDto, config?: any) => {
   return axios.post(`/api/member/createAddr`, data, config);
}
/**
* updateAddr:编辑会员地址
* id：id;
* @returns 
*/
export const MemberMangerControllerUpdate = (id: String,data: AddrMangerDto, config?: any) => {
   return axios.post(`/api/member/updateAddr/${id}`, data, config);
}
/**
* deleteAddr:删除会员地址
* id：id;
* @returns 
*/
export const MemberMangerControllerDeleteAddr = (id: String, config?: any) => {
   return axios.delete(`/api/member/deleteAddr/${id}`, config);
}
             

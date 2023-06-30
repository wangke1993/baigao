
/**
* 鉴权
*/
import axios from 'axios';
import type { LoginFromDto } from './dto/LoginFromDto';
import type { WeChatRegisterDto } from './dto/WeChatRegisterDto';


/**
* 后台用户登录
* 
* @returns 
*/
export const AuthControllerLogin = (data: LoginFromDto, config?: any) => {
   return axios.post(`/api/auth/admin/login`, data, config);
}
/**
* 小程序用户登录
* code：code;
* @returns 
*/
export const AuthControllerWeChatLogin = (code: String, config?: any) => {
   return axios.post(`/api/auth/weChat/login/${code}`, {}, config);
}
/**
* 小程序用户登录刷新
* 
* @returns 
*/
export const AuthControllerWeChatLoginRefresh = ( config?: any) => {
   return axios.post(`/api/auth/weChat/loginRefresh`, {}, config);
}
/**
* 后台用户登录
* 
* @returns 
*/
export const AuthControllerAdminLoginRefresh = ( config?: any) => {
   return axios.post(`/api/auth/admin/loginRefresh`, {}, config);
}
/**
* 小程序新用户授权注册并登录
* 
* @returns 
*/
export const AuthControllerRegister = (data: WeChatRegisterDto, config?: any) => {
   return axios.post(`/api/auth/weChat/register`, data, config);
}
/**
* phoneNumber:获取小程序用户手机号
* code：code;
* @returns 
*/
export const AuthControllerGetWeChatPhoneNumber = (code: String, config?: any) => {
   return axios.post(`/api/auth/weChat/phoneNumber/${code}`, {}, config);
}
/**
* QRAuthorize:扫码授权登录
* QRKey：QRKey;
* @returns 
*/
export const AuthControllerQRAuthorize = (QRKey: String, config?: any) => {
   return axios.get(`/api/auth/weChat/QRAuthorize/${QRKey}`, { ...config });
}

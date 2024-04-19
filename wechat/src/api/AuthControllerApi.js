
/**
* 鉴权
*/
import {post,get,del} from '@/utils/request.js';
// LoginFromDto：./dto/LoginFromDto';
// WeChatRegisterDto：./dto/WeChatRegisterDto';


/**
* 后台用户登录
* 
* @returns 
*/
export function AuthControllerLogin(LoginFromDto){
   return post(`/auth/admin/login`, LoginFromDto);
}
/**
* 小程序用户登录
* code：code;
* @returns 
*/
export function AuthControllerWeChatLogin(code){
   return post(`/auth/weChat/login/${code}`, {});
}
/**
* 小程序用户登录
* code：code;
* @returns 
*/
export function AuthControllerWeChatLoginRegistration(code){
   return post(`/auth/weChat/loginRegistration/${code}`, {});
}
/**
* 小程序用户登录刷新
* 
* @returns 
*/
export function AuthControllerWeChatLoginRefresh(){
   return post(`/auth/weChat/loginRefresh`, {});
}
/**
* 后台用户登录
* 
* @returns 
*/
export function AuthControllerAdminLoginRefresh(){
   return post(`/auth/admin/loginRefresh`, {});
}
/**
* 小程序新用户授权注册并登录
* 
* @returns 
*/
export function AuthControllerRegister(WeChatRegisterDto){
   return post(`/auth/weChat/register`, WeChatRegisterDto);
}
/**
* phoneNumber:获取小程序用户手机号
* code：code;
* @returns 
*/
export function AuthControllerGetWeChatPhoneNumber(code){
   return post(`/auth/weChat/phoneNumber/${code}`, {});
}
/**
* QRAuthorize:扫码授权登录
* QRKey：QRKey;
* @returns 
*/
export function AuthControllerQRAuthorize(QRKey){
	// query:{} 
   return get(`/auth/weChat/QRAuthorize/${QRKey}`, {});
}

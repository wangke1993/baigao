
/**
* 短信相关
*/
import {post,get,del} from '@/utils/request.js';


/**
* 发送验证码
* phone：phone;
* @returns 
*/
export function SMSControllerSendCode(phone){
	// query:{} 
   return get(`/SMS/sendCode/${phone}`, {});
}
/**
* 验证手机号验证码
* phone：phone;code：code;
* @returns 
*/
export function SMSControllerVerifyPhoneNumber(phone,code){
	// query:{} 
   return get(`/SMS/verifyPhoneNumber/${phone}/${code}`, {});
}


/**
* 短信相关
*/
import axios from 'axios';


/**
* 发送验证码
* phone：phone;
* @returns 
*/
export const SMSControllerSendCode = (phone: string, config?: any) => {
   return axios.get(`/api/SMS/sendCode/${phone}`, { ...config });
}
/**
* 验证手机号验证码
* phone：phone;code：code;
* @returns 
*/
export const SMSControllerVerifyPhoneNumber = (phone: string,code: string, config?: any) => {
   return axios.get(`/api/SMS/verifyPhoneNumber/${phone}/${code}`, { ...config });
}

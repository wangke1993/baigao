
/**
* 微信相关API
*/
import axios from 'axios';


/**
* createQRUrl:创建用户二维码,startPage:启动页
* startPage：undefined;
* @returns 
*/
export const WeChatApiControllerCreateQRUrl = (query: { startPage: String }, config?: any) => {
   return axios.get(`/api/wechat/createQRUrl`, { params: query,...config });
}
/**
* createWeChatQR:query: { page: string, scene: string }根据参数生成太阳码
* page：undefined;scene：undefined;
* @returns 
*/
export const WeChatApiControllerCreateWeChatQR = (query: { page: String,scene: String }, config?: any) => {
   return axios.get(`/api/wechat/createWeChatQR`, { params: query,...config });
}
/**
* 获取登录小程序登录码
* page：undefined;
* @returns 
*/
export const WeChatApiControllerCreateLoginQRUrl = (query: { page: String }, config?: any) => {
   return axios.get(`/api/wechat/createLoginQRUrl`, { params: query,...config });
}
/**
* 变更扫码状态到已扫码
* loginKey：undefined;
* @returns 
*/
export const WeChatApiControllerChangeQRStatusToSCAN = (query: { loginKey: String }, config?: any) => {
   return axios.get(`/api/wechat/changeQRStatusToSCAN`, { params: query,...config });
}
/**
* 查询扫码状态及授权结果
* QRKey：QRKey;
* @returns 
*/
export const WeChatApiControllerCheckLoginQr = (QRKey: String, config?: any) => {
   return axios.get(`/api/wechat/checkLoginQr/${QRKey}`, { ...config });
}
/**
* orderPay:订单支付
* orderId：orderId;
* @returns 
*/
export const WeChatApiControllerOrderPay = (orderId: String, config?: any) => {
   return axios.get(`/api/wechat/orderPay/${orderId}`, { ...config });
}
/**
* 订单支付回调
* 
* @returns 
*/
export const WeChatApiControllerPayNotifyUrl = ( config?: any) => {
   return axios.post(`/api/wechat/payNotifyUrl`, {}, config);
}
/**
* orderRefunds:管理员操作退款:id:订单id,refundsCause:退款原因
* id：id;refundsCause：undefined;
* @returns 
*/
export const WeChatApiControllerOrderRefunds = (id: String,query: { refundsCause: String }, config?: any) => {
   return axios.get(`/api/wechat/orderRefunds/${id}`, { params: query,...config });
}
/**
* withdrawal:会员提现
* money：money;
* @returns 
*/
export const WeChatApiControllerWithdrawal = (money: String, config?: any) => {
   return axios.get(`/api/wechat/withdrawal/${money}`, { ...config });
}
/**
* 订单退款回调
* 
* @returns 
*/
export const WeChatApiControllerRefundsNotifyUrl = ( config?: any) => {
   return axios.post(`/api/wechat/refundsNotifyUrl`, {}, config);
}

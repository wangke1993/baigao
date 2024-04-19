
/**
* 微信相关API
*/
import {post,get,del} from '@/utils/request.js';


/**
* 发送消息
* socketId：socketId;
* @returns 
*/
export function WeChatApiControllerToMessage(socketId){
	// query:{} 
   return get(`/wechat/toMessage/${socketId}`, {});
}
/**
* 获取微信公众号用户
* 
* @returns 
*/
export function WeChatApiControllerGetAllMpUserInfo(){
	// query:{} 
   return get(`/wechat/getAllMpUserInfo`, {});
}
/**
* createQRUrl:创建用户二维码,startPage:启动页
* startPage：undefined;
* @returns 
*/
export function WeChatApiControllerCreateQRUrl(query){
	// query:{startPage} 
   return get(`/wechat/createQRUrl`, query);
}
/**
* createWeChatQR:query: { page: string, scene: string }根据参数生成太阳码
* page：undefined;scene：undefined;
* @returns 
*/
export function WeChatApiControllerCreateWeChatQR(query){
	// query:{page,scene} 
   return get(`/wechat/createWeChatQR`, query);
}
/**
* 获取登录小程序登录码
* page：undefined;
* @returns 
*/
export function WeChatApiControllerCreateLoginQRUrl(query){
	// query:{page} 
   return get(`/wechat/createLoginQRUrl`, query);
}
/**
* 变更扫码状态到已扫码
* loginKey：undefined;
* @returns 
*/
export function WeChatApiControllerChangeQRStatusToSCAN(query){
	// query:{loginKey} 
   return get(`/wechat/changeQRStatusToSCAN`, query);
}
/**
* 查询扫码状态及授权结果
* QRKey：QRKey;
* @returns 
*/
export function WeChatApiControllerCheckLoginQr(QRKey){
	// query:{} 
   return get(`/wechat/checkLoginQr/${QRKey}`, {});
}
/**
* orderPay:订单支付
* orderId：orderId;
* @returns 
*/
export function WeChatApiControllerOrderPay(orderId){
	// query:{} 
   return get(`/wechat/orderPay/${orderId}`, {});
}
/**
* 订单支付回调
* 
* @returns 
*/
export function WeChatApiControllerPayNotifyUrl(){
   return post(`/wechat/payNotifyUrl`, {});
}
/**
* orderRefunds:管理员操作退款:id:订单id,refundsCause:退款原因
* id：id;refundsCause：undefined;
* @returns 
*/
export function WeChatApiControllerOrderRefunds(id,query){
	// query:{refundsCause} 
   return get(`/wechat/orderRefunds/${id}`, query);
}
/**
* withdrawal:会员提现
* money：money;
* @returns 
*/
export function WeChatApiControllerWithdrawal(money){
	// query:{} 
   return get(`/wechat/withdrawal/${money}`, {});
}
/**
* 订单退款回调
* 
* @returns 
*/
export function WeChatApiControllerRefundsNotifyUrl(){
   return post(`/wechat/refundsNotifyUrl`, {});
}
/**
* queryPayOrder:查询订单结果
* payOrderNum：payOrderNum;
* @returns 
*/
export function WeChatApiControllerQueryPayOrder(payOrderNum){
	// query:{} 
   return get(`/wechat/queryPayOrder/${payOrderNum}`, {});
}
/**
* 验证用户是否关注公众号
* 
* @returns 
*/
export function WeChatApiControllerVerifyWeChatBinding(){
	// query:{} 
   return get(`/wechat/verifyWeChatBinding`, {});
}

export enum TRADE_STATE {
    '支付成功' = 'SUCCESS',
    '转入退款' = 'REFUND',
    '未支付' = 'NOTPAY',
    '已关闭' = 'CLOSED',
    '已撤销（付款码支付）' = 'REVOKED',
    '用户支付中（付款码支付）' = 'USERPAYING',
    '支付失败(其他原因，如银行返回失败)' = 'PAYERROR'
}
export enum REFUND_STATUS {
    '退款成功' = 'SUCCESS',
    '退款关闭' = 'CLOSED',
    '退款异常，退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往【商户平台—>交易中心】，手动处理此笔退款' = 'ABNORMAL'
}
export enum LOGIN_QR_STATUS {
    '待扫码' = 'AWAIT',
    '已扫码' = 'SCAN',
    '已授权' = 'AUTHORIZE',
    '已过期' = 'EXPIRE'
}
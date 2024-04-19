export class PayResDto {
    constructor(result: any) {
        this.appid = result?.appid;
        this.amount = result?.amount;
        this.attach = result?.attach;
        this.bank_type = result?.bank_type;
        this.out_trade_no = result?.out_trade_no;
        this.payer = result?.payer;
        this.promotion_detail = result?.promotion_detail;
        this.success_time = result?.success_time;
        this.trade_state = result?.trade_state;
        this.trade_state_desc = result?.trade_state_desc;
        this.trade_type = result?.trade_type;
        this.transaction_id = result?.transaction_id;
    }
    appid: String;
    amount: Amount;
    attach: String;
    bank_type: String;
    out_trade_no: String;
    payer: Payer;
    promotion_detail: [];
    success_time: String;
    /**
     * 交易状态
     */
    trade_state: TRADE_STATE;
    trade_state_desc: String;
    /**
     * 交易类型
     */
    trade_type: TRADE_TYPE;
    /**
     * 微信支付订单号
     */
    transaction_id: String;

    /**
     * 是否支付成功
     */
    PaymentSuccessful() {
        return this.trade_state == TRADE_STATE.支付成功;
    }
    /**
     * 是否再次通知
     * 订单未支付就继续查询，30秒查询一次
     */
    notifyAgain() {
        return this.trade_state == TRADE_STATE.未支付;
    }
}
enum TRADE_STATE {
    "支付成功" = "SUCCESS",
    "转入退款" = "REFUND",
    "未支付" = "NOTPAY",
    "已关闭" = "CLOSED",
    "已撤销仅付款码支付会返回" = "REVOKED",
    "用户支付中仅付款码支付会返回" = "USERPAYING",
    "支付失败仅付款码支付会返回" = "PAYERROR",
}
enum TRADE_TYPE {
    "公众号支付" = "JSAPI",
    "扫码支付" = "NATIVE",
    "APP支付" = "APP",
    "付款码支付" = "MICROPAY",
    "H5支付" = "MWEB",
    "刷脸支付" = "FACEPAY"
}
class Payer {
    openid: String;
}
class Amount {
    "currency": String;
    "payer_currency": String;
    "payer_total": Number;
    "total": Number;
}
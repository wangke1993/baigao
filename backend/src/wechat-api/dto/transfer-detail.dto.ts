export class TransferDetailDto {
    constructor(user_name?: string) {
        if (user_name) {
            this.user_name = user_name;
        }
    }
    /**
     * 转账明细单号
     */
    out_detail_no: string;
    /**
     *  转账金额(分)
     */
    transfer_amount: number;
    /**
     * 转账备注
     */
    transfer_remark: string;
    /**
     * 用户openId
     */
    openid: string;
    /**
     * 收款人姓名crypto,对微信昵称进行加密,名字传入时需要进行加密否则接口无法使用
     */
    user_name?: string;
}
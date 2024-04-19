
/**
 * 转账到零钱结果
 */
export class TransferToChangeResultDto {
    constructor(queryRes?: any) {
        if (queryRes) {
            this.resultStr = queryRes;
            if (queryRes.detail_status == 'SUCCESS') {
                this.success = true;
            } else if (queryRes.detail_status == 'FAIL') {
                this.success = false;
                this.message = FAIL_REASON[queryRes.fail_reason];
            }
        }
    }
    resultStr: string;
    success: Boolean;
    message: string;
}
const FAIL_REASON = {
    "ACCOUNT_FROZEN": "该用户账户被冻结",
    "REAL_NAME_CHECK_FAIL": "收款人未实名认证，需要用户完成微信实名认证",
    "NAME_NOT_CORRECT": "收款人姓名校验不通过，请核实信息",
    "OPENID_INVALID": "Openid格式错误或者不属于商家公众账号",
    "TRANSFER_QUOTA_EXCEED": "超过用户单笔收款额度，核实产品设置是否准确",
    "DAY_RECEIVED_QUOTA_EXCEED": "超过用户单日收款额度，核实产品设置是否准确",
    "MONTH_RECEIVED_QUOTA_EXCEED": "超过用户单月收款额度，核实产品设置是否准确",
    "DAY_RECEIVED_COUNT_EXCEED": "超过用户单日收款次数，核实产品设置是否准确",
    "PRODUCT_AUTH_CHECK_FAIL": "未开通该权限或权限被冻结，请核实产品权限状态",
    "OVERDUE_CLOSE": "超过系统重试期，系统自动关闭",
    "ID_CARD_NOT_CORRECT": "收款人身份证校验不通过，请核实信息",
    "ACCOUNT_NOT_EXIST": "该用户账户不存在",
    "TRANSFER_RISK": "该笔转账可能存在风险，已被微信拦截",
    "OTHER_FAIL_REASON_TYPE": "其它失败原因",
    "REALNAME_ACCOUNT_RECEIVED_QUOTA_EXCEED": "用户账户收款受限，请引导用户在微信支付查看详情",
    "RECEIVE_ACCOUNT_NOT_PERMMIT": "未配置该用户为转账收款人，请在产品设置中调整，添加该用户为收款人",
    "PAYEE_ACCOUNT_ABNORMAL": "用户账户收款异常，请联系用户完善其在微信支付的身份信息以继续收款",
    "PAYER_ACCOUNT_ABNORMAL": "商户账户付款受限，可前往商户平台获取解除功能限制指引",
    "TRANSFER_SCENE_UNAVAILABLE": "该转账场景暂不可用，请确认转账场景ID是否正确",
    "TRANSFER_SCENE_INVALID": "你尚未获取该转账场景，请确认转账场景ID是否正确",
    "TRANSFER_REMARK_SET_FAIL": "转账备注设置失败， 请调整后重新再试",
    "RECEIVE_ACCOUNT_NOT_CONFIGURE": "请前往商户平台-商家转账到零钱-前往功能-转账场景中添加",
    "BLOCK_B2C_USERLIMITAMOUNT_BSRULE_MONTH": "超出用户单月转账收款20w限额，本月不支持继续向该用户付款",
    "BLOCK_B2C_USERLIMITAMOUNT_MONTH": "用户账户存在风险收款受限，本月不支持继续向该用户付款",
    "MERCHANT_REJECT": "商户员工（转账验密人）已驳回转账",
    "MERCHANT_NOT_CONFIRM": "商户员工（转账验密人）超时未验密"
}
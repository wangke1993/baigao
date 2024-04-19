import { DC0012, DC0014 } from "src/data-dictionary/dic-enum";
import { MemberManagement } from "src/member-management/dto/member-management.schema";
import { formatDate } from "src/utils/date-tools";
import { WalletManagement } from "src/wallet-management/dto/wallet-management.schema";
import { WithdrawalManagement } from "src/withdrawal-management/dto/withdrawal-management.schema";

/**
 * 公众号模板消息发送请求
 * 2023年5月4日后，不再支持first和remark字段
 * 参考
 *  https://mp.weixin.qq.com/s/hvLO4Vs75NXDA__SxuyKXw
 */
export class MpTplMsgRequestDto {
    constructor() {
        this.miniprogram = { appid: '', pagepath: '' }
    }

    /**
     * 通知客户经理有新订单
     */
    notifyTheAccountManager(order: any) {
        /**
         * 点击后进入小程序查看订单详情
         */
        this.template_id = '-xxx';
        const appointment = JSON.parse(order.appointmentInformationSnapshot);
        this.data = {
            keyword1: dataItem(formatDate(order.addDate)),
            keyword2: dataItem(JSON.parse(order.serviceSnapshot).forShort),
            keyword3: dataItem(`${appointment.contacts}(${appointment.contactNumber})`),
            keyword4: dataItem("有新的订单，请尽快处理!(点击处理)"),
        }
        this.miniprogram.pagepath = `/order/Detail?UUID=${order.UUID}`
        return this;
    };
    /**
     * 通知客户签订合同，看orderStatus为待签合同的就才进行通知
     */
    notifyCustomersToSignContracts(order: any) {
        /**
         * 点击后跳转小程序跳转到订单详情进行签约
         */
        this.template_id = 'xxx-oPC8iqCY8'
        this.data = {
            // first: dataItem('您的订单信息已经确认,请您签订合同以确保订单的正式生效。'),
            character_string1: dataItem(order.orderNum),
            thing6: dataItem(`${JSON.parse(order.serviceSnapshot).forShort}(点击签订合同)`),
            time7: dataItem(formatDate(order.addDate)),
            // remark: dataItem('点击查看详情签订合同')
        }
        this.miniprogram.pagepath = `/order/Detail?UUID=${order.UUID}`
        return this;
    }

    /**
     * 通知客户缴费
     */
    notifyCustomersToMakePayments(orderNum: string) {
        /**
         * 点击后跳转小程序钱包充值界面
         */
        this.template_id = 'xxx';
        this.data = {
            character_string5: dataItem(orderNum),
            thing6: dataItem(`温馨提示，您余额已不足(点击充值)`)
        }
        this.miniprogram.pagepath = `/wallet/RechargeWallet`
        return this;
    }
    /**
     * 通知客户评价
     */
    notifyCustomerFeedback(order: any, serviceOrder: any) {
        /**
         * 点击后跳转到小程序订单详情界面
         */
        this.template_id = 'xxx-xxxx-xxx'
        this.data = {
            // first: dataItem('您的订单已完成，为了不断提升我们的服务水平，我们非常重视您的评价。请您花费一点时间为我们提供反馈，让我们知道您对我们的服务满意度和建议。'),
            character_string1: dataItem(order.orderNum),
            time7: dataItem(`${formatDate(serviceOrder.serviceEndTime)}`),
            // time7: dataItem(`${formatDate(serviceOrder.serviceStartTime)} - ${formatDate(serviceOrder.serviceEndTime)}`),
            // remark: dataItem('点击详情进行评价')
        };
        this.miniprogram.pagepath = `/order/Detail?UUID=${order.UUID}`
        return this;
    }

    /**
     * 通知财务有提现
     */
    notifyTheFinanceDepartmentToWithdrawFunds(withdrawal: WithdrawalManagement) {
        /**
         * 用户提现后，通知财务有人提现
         * 内容：
         *  您好，您有新的提现请求
         *  提现人：全力以赴
         *  提现金额：100元
         *  请及时处理
         * 地址：
         * 
         */
        this.template_id = 'Il1L3c200BPNQaJmFaQyC485UvUQFA2Jh3Ov3ozkP8o';
        const withdrawalPersonName = withdrawal.withdrawal == DC0012.会员提现
            ? `会员-${JSON.parse(withdrawal.userSnapshot).name}`
            : `服务人员-${JSON.parse(withdrawal.userSnapshot).name}`;
        this.data = {
            "keyword1": dataItem(withdrawalPersonName),
            "keyword2": dataItem(`${(withdrawal.amount / 100).toFixed(2)}元`),
        };
        // TODO:点击后进入提现申请审核页面
        return this;
    }
    /**
     * 发送给指定用户
     * @param openid 
     * @returns 
     */
    to(openid: string) {
        this.touser = openid;
        return this;
    };
    /**
     * 设置小程序appid
     * @param appid 
     */
    setMiniProgramAppid(appid: string) {
        this.miniprogram.appid = appid;
    }
    /**
     * 接收者openid，必填
     */
    touser: string;
    /**
     * 模板ID，必填
     */
    template_id: string;
    /**
     * 模板跳转链接（海外账号没有跳转能力）
     */
    url?: string;

    /**
     * 跳小程序所需数据，不需跳小程序可不用传该数据
     */
    miniprogram?: {
        /**
         * 小程序appid
         */
        appid: string
        /**
         * 跳转页面地址
         */
        pagepath?: string
    };

    /**
     * 模板数据
     */
    data: any;

    /**
     * 防重入id。对于同一个openid + client_msg_id, 只发送一条消息,10分钟有效,超过10分钟不保证效果。若无防重入需求，可不填
     */
    client_msg_id?: string;
}
const dataItem = (value: string) => {
    return { value };
};
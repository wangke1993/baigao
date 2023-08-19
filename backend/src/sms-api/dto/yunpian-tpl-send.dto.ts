import * as https from 'https';
import { stringify } from 'qs'
/**
 * 云片网发送短信，请求模型
 */
export class YunPianTplReq {
    constructor(phone: string[], templateId: string, templateData: any) {
        this.mobile = phone.join(',');
        this.tpl_id = templateId;
        this.tpl_value = {};
        for (const key in templateData) {
            console.log(templateData[key]);
            this.tpl_value[`#${key}#`] = templateData[key];
        }

    }
    send() {
        return new Promise<any>((res, rej) => {
            // res(new YunPianTplRes([new ResStatusData(JSON.parse('{"code":0,"msg":"发送成功","count":1,"fee":0.05,"unit":"RMB","mobile":"17612702450","sid":76428494534}'))]));
            const options = {
                hostname: 'sms.yunpian.com',
                port: 443,
                path: '/v2/sms/tpl_batch_send.json',
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            };
            
            const req = https.request(options, (smsRes) => {
                let data = '';
                smsRes.setEncoding("utf8");
                smsRes.on("data", (chunk: string) => {
                    data += chunk;
                });
                smsRes.on("end", () => {
                    res(JSON.parse(data));
                })
            });
            req.write(stringify({
                apikey: this.apikey,
                mobile: this.mobile,
                tpl_id: this.tpl_id,
                tpl_value: stringify(this.tpl_value),
            }));
            req.end();
        });
    }
    /**
     * 用户唯一标识，在账号设置-子帐号管理中查看
     */
    apikey: string;
    /**
     * 接收的手机号，发送多个手机号请以英文逗号分隔，建议单次提交 200 个手机号以内，不要超过 1000 个，不需要带+86 前缀
     */
    mobile: string;
    /**
     * 模板 id
     */
    tpl_id: string;
    /**
     * 变量名和变量值对。请先对您的变量名和变量值分别进行 urlencode 再传递。使用参考：代码示例。 
     * 注：模板中有变量时，变量名和变量值都不能为空，模板中没有变量时，赋值 tplvalue=""
     * 模板：【云片网】亲爱的#name#，您的验证码是#code#。如非本人操作，请忽略本短信。
     * 最终发送结果： 
     * 【云片网】亲爱的张三，您的验证码是1234。如非本人操作，请忽略本短信。 
     * tplvalue=urlencode("#code#") + "=" + urlencode("1234") + "&" + urlencode("#name#") + "=" + urlencode("张三"); 
     * 若您直接发送报文请求则使用下面这种形式 tplvalue=urlencode(urlencode("#code#") + "=" + urlencode("1234") + "&" + urlencode("#name#") + "=" + urlencode("张三"));
     */
    tpl_value: any;
    /**
     * 短信发送后将向这个地址推送(运营商返回的)发送报告。 
     * 如推送地址固定，建议在"数据推送与获取”做批量设置。 
     * 如后台已设置地址，且请求内也包含此参数，将以请求内地址为准
     */
    callback_url?: string;
    /**
     * 扩展号。默认不开放，如有需要请联系客服申请
     */
    extend?: string;
    /**
     * 用户自定义唯一 id。最大长度不超过 256 的字符串。
     */
    uid?: string;
}
/**
 * 云片网短信发送返回结果模型
 */
export class YunPianTplRes {
    constructor(data: ResStatusData[]) {
        this.data = data;
        this.total_count = data.length;
        this.unit = data[0].unit;
    }
    total_count: number;
    total_fee: string;
    unit: string;
    data: ResStatusData[];
}
/**
 * 示例：
 * 
 */
export class ResStatusData {
    constructor(data: ResStatusData) {
        this.code = data.code;
        this.msg = data.msg;
        this.count = data.count;
        this.fee = data.fee;
        this.unit = data.unit;
        this.mobile = data.mobile;
        this.sid = data.sid;
    }
    code: ResStatusCode;
    msg: string;
    count: number;
    fee: string;
    unit: string;
    mobile: string;
    sid: string;

    isSuccess() {
        return this.code == ResStatusCode.成功;
    }
}
enum ResStatusCode {
    '成功' = 0,
    '失败' = 2
}
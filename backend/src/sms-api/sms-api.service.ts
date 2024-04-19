import { Injectable } from '@nestjs/common';
import UniSMS from 'unisms';
import { CONF_TYPE } from '../system-config/dto/system-config.schema';
import { SystemConfigService } from '../system-config/system-config.service';
import axios from 'axios';
import { ResStatusData, YunPianTplReq, YunPianTplRes } from './dto/yunpian-tpl-send.dto';
import { SystemLogService } from 'src/system-log/system-log.service';
import { DC0003 } from 'src/data-dictionary/dic-enum';
@Injectable()
export class SmsApiService {
    private client: UniSMS;
    private smsConf: any;
    constructor(
        private systemConfigService: SystemConfigService,
        private systemLogService: SystemLogService
    ) {

    };
    /**
     * 云片网发送短信
     * https://www.yunpian.com/
     * @param phone 手机号，字符串或字符串数组
     * @param templateId 模板id
     * @param templateData 模板变量{a:'',b:''}
     * @returns 
     */
    async send(phone: string[], templateId: string, templateData: any, req?: any): Promise<YunPianTplRes> {
        this.smsConf = await this.systemConfigService.getConfigObjByConfType(CONF_TYPE.短信参数设置);
        if (this.smsConf[DC0003.是否启用] == '0') {
            console.warn('短信发送未开启');
            throw new Error("短信发送未开启");
        }
        const yunPianTplReq = new YunPianTplReq(phone, templateId, templateData);
        yunPianTplReq.apikey = this.smsConf[DC0003.accessKeyId];
        console.log('【发送短信】', JSON.stringify(yunPianTplReq));
        const res: YunPianTplRes = await yunPianTplReq.send();
        yunPianTplReq.apikey = '****';
        this.systemLogService.create('【短信发送】', `请求：${JSON.stringify(yunPianTplReq)},响应${JSON.stringify(res)}`, req)
        return res;
    }
    async init() {
        this.smsConf = await this.systemConfigService.getConfigObjByConfType(CONF_TYPE.短信参数设置);
        console.log('初始化短信', this.smsConf);
        this.client = new UniSMS({
            accessKeyId: this.smsConf[DC0003.accessKeyId]
        })
    }
    /**
     * UNI发送短信
     * @param phone 手机号，字符串或字符串数组
     * @param templateId 模板id
     * @param templateData 模板变量{a:'',b:''}
     * @returns 
     */
    async sendMSM(phone: string | string[], templateId: string, templateData: any): Promise<any> {
        if (!this.client) {
            await this.init();
        }
        if (this.smsConf[DC0003.是否启用] == '0') {
            console.warn('短信发送未开启');
            throw new Error('短信发送未开启');
        }
        console.log('【发送短信】', phone, templateId, JSON.stringify(templateData));
        try {
            if (phone.length < 1) {
                throw new Error('手机号不能为空');
            }
            const res = await this.client.send({
                to: phone,
                signature: this.smsConf[DC0003.短信签名],
                templateId: templateId,
                templateData: templateData
            });
            console.log('【发送短信结果】', JSON.stringify(res));
            return res;
        } catch (error) {
            console.error('短信发送异常', error);
            throw new Error(error);
        }
    }

}

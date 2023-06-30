import { Injectable, Logger } from '@nestjs/common';
import UniSMS from 'unisms';
import { CONF_TYPE, DC0003 } from '../system-config/dto/system-config.schema';
import { SystemConfigService } from '../system-config/system-config.service';
@Injectable()
export class SmsApiService {
    private readonly logger = new Logger(SmsApiService.name);
    private client: UniSMS;
    private smsConf: any;
    constructor(
        private systemConfigService: SystemConfigService
    ) {

    };
    async init() {
        this.logger.log('初始化短信');
        this.smsConf = await this.systemConfigService.getConfigObjByConfType(CONF_TYPE.短信参数设置);
        this.client = new UniSMS({
            accessKeyId: this.smsConf[DC0003.短信API密钥]
        })
    }
    /**
     * 发送短信
     * @param phone 手机号，字符串或字符串数组
     * @param templateId 模板id
     * @param templateData 模板变量{a:'',b:''}
     * @returns 
     */
    async sendMSM(phone: string | string[], templateId: string, templateData: any): Promise<any> {
        if (!this.client) {
            await this.init();
        }
        if (this.smsConf[DC0003.是否启用短信] == '0') {
            this.logger.warn('短信发送未开启');
            return null;
        }
        this.logger.log('【发送短信】', phone, templateId, JSON.stringify(templateData));
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
            this.logger.log('【发送短信结果】', JSON.stringify(res));
            return res;
        } catch (error) {
            this.logger.error('短信发送异常', error);
            return null;
        }
    }
}

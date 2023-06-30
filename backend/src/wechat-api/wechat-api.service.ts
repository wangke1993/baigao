import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberMangerService } from '../member-manger/member-manger.service';
import { readFileSync } from 'fs';
import { SystemConfigService } from '../system-config/system-config.service';
import { CONF_TYPE, DC0005 } from '../system-config/dto/system-config.schema';
import { TransferDetailDto } from './dto/transfer-detail.dto';
import { v4 as uuidV4 } from 'uuid';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { LOGIN_QR_STATUS } from './dto/enum.dto';
const WxPay = require('wechatpay-node-v3');
@Injectable()
export class WeChatApiService {
    private readonly logger = new Logger(WeChatApiService.name);
    private payConfig: any;
    constructor(
        private fileUploadService: FileUploadService,
        private authService: AuthService,
        private memberMangerService: MemberMangerService,
        private systemConfigService: SystemConfigService,
        private transaction: TransactionHelper,
        private redisCacheService: RedisCacheService

    ) {

    };
    async init() {
        this.payConfig = await this.systemConfigService.getConfigObjByConfType(CONF_TYPE.支付参数设置);
        const publicKeyPath: string = this.payConfig[DC0005.公钥];
        const privateKeyPath: string = this.payConfig[DC0005.私钥];
        if (publicKeyPath && privateKeyPath) {
            return new WxPay({
                appid: this.payConfig[DC0005.应用ID],
                mchid: this.payConfig[DC0005.商户号],
                publicKey: readFileSync(publicKeyPath), // 公钥
                privateKey: readFileSync(privateKeyPath), // 秘钥
            });
        } else {
            this.logger.error('------------------------------没有上传商户支付公钥或私钥，支付功能无法使用------------------------------');
        }
    }
    // 生成太阳码：会员二维码，经销商二维码
    async createQR(openId: string, memberId: string, page: string): Promise<string> {
        const access_token = await this.authService.getAccessToken(openId);
        const { data } = await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`, {
            scene: `${openId}`,
            page,
            check_path: false,
        }, { responseType: "arraybuffer" });
        const enc = new TextDecoder("utf-8");
        const uint8Msg = new Uint8Array(data);
        let resJson: any = {};
        try {
            resJson = JSON.parse(enc.decode(uint8Msg));
        } catch (error) { }
        if (resJson?.errcode) {
            throw new Error(`${resJson.errcode}-${resJson.errmsg}`);
        }
        const fileName = `userQR_${openId}.jpeg`;
        const QRFile = await this.fileUploadService.createByBlob(fileName, data, false);
        await this.memberMangerService.setMemberQR(memberId, QRFile.url, QRFile._id);
        return QRFile.url;
    }
    async getQR(scene: string, openId: string, page: string): Promise<any> {
        const access_token = await this.authService.getAccessToken(openId);
        const { data } = await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`, {
            scene,
            page,
            check_path: false,
        }, { responseType: "arraybuffer" });
        const enc = new TextDecoder("utf-8");
        const uint8Msg = new Uint8Array(data);
        let resJson: any = {};
        try {
            resJson = JSON.parse(enc.decode(uint8Msg));
        } catch (error) { }
        if (resJson?.errcode) {
            throw new Error(`${resJson.errcode}-${resJson.errmsg}`);
        }
        return `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
    }
    async createLoginQR(page: string): Promise<LoginQrDto> {
        const access_token = await this.authService.getAccessToken();
        const loginId = `${uuidV4().replace(/-/g, '')}`.toLowerCase().substring(0, 16);
        const { data } = await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`, {
            scene: `${loginId}`,
            page,
            check_path: false,
        }, { responseType: "arraybuffer" });
        const enc = new TextDecoder("utf-8");
        const uint8Msg = new Uint8Array(data);
        let resJson: any = {};
        try {
            resJson = JSON.parse(enc.decode(uint8Msg));
        } catch (error) { }
        if (resJson?.errcode) {
            throw new Error(`${resJson.errcode}-${resJson.errmsg}`);
        }
        const loginQrDto: LoginQrDto = {
            QR: `data:image/png;base64,${Buffer.from(data).toString("base64")}`,
            key: loginId
        };
        this.redisCacheService.set(loginId, LOGIN_QR_STATUS.待扫码, 15 * 60); // 15分钟过期
        return loginQrDto;
    }
    // 文档地址https://github.com/klover2/wechatpay-node-v3-ts
    /**
     * 
     * @param memberOpenId 支付用户openId
     * @param orderNo 订单编号
     * @param orderDescription 订单描述
     * @param money 支付金额
     * @returns 
     */
    async jsapiPay(memberOpenId: string, orderNo: string, orderDescription: string, money: number): Promise<any> {
        const pay = await this.init();
        const params = {
            description: orderDescription,
            out_trade_no: orderNo,
            notify_url: this.payConfig[DC0005.支付回调地址],
            amount: {
                total: money,
            },
            payer: {
                openid: memberOpenId,
            },
        };
        // this.logger.log(params);
        const result = await pay.transactions_jsapi(params);
        // this.logger.log(result);
        // {
        //     appId: 'appid',
        //     timeStamp: '1609918952',
        //     nonceStr: 'y8aw9vrmx8c',
        //     package: 'prepay_id=wx0615423208772665709493edbb4b330000',
        //     signType: 'RSA',
        //     paySign: 'JnFXsT4VNzlcamtmgOHhziw7JqdnUS9qJ5W6vmAluk3Q2nska7rxYB4hvcl0BTFAB1PBEnHEhCsUbs5zKPEig=='
        // }
        return result;
    }
    /**
     * 订单退款
     * @param id 
     * @param refundsCause 
     * @param req 
     * @param isWallet 是否仅为解除钱包冻结资金
     */
    async refundsOrder(id: string, refundsCause: string, req?: any, isWallet?: Boolean): Promise<any> {
        let refundsNo = `${uuidV4().replace(/-/g, '')}`.toUpperCase();
        const { message } = await this.refunds("orderNo", refundsNo, refundsCause, 10, 10);
        // return this.OrderMangerModel.updateOne({ orderNo: orderNo }, { orderStatus, refundId, refundContent });
    }

    // 0851-12345
    /**
     * 退款
     * @param orderNo 订单号：支付的时候使用的订单号
     * @param refundNo 退款单号：系统内部生成
     * @param reason 退款原因
     * @param refund 退款金额
     * @param total 原订单金额
     * @returns 
     */
    async refunds(orderNo: string, refundNo: string, reason: string, refund: number, total: number): Promise<any> {
        const pay = await this.init();
        const params = {
            out_trade_no: orderNo,
            out_refund_no: refundNo,
            reason: reason,
            notify_url: this.payConfig[DC0005.退款回调地址],
            amount: {
                refund: refund,
                total: total,
                currency: 'CNY',
            },
        };
        this.logger.log('退款请求参数', params);
        const result = await pay.refunds(params);
        this.logger.log('退款返回结果', result);
        return result;
    }
    /**
     * 查询退款
     * @param refundsNo 退款单号
     * @returns 
     */
    async findRefunds(refundsNo: string): Promise<any> {
        const pay = await this.init();
        const result = await pay.find_refunds(refundsNo);
        this.logger.log('退款查询', result);
        return result
    }
    /**
     * 转账到零钱
     * @param outBatchNo 转账批次编号
     * @param batchName 转账批次名称
     * @param batchRemark 转账批次备注
     * @param transferDetail 转账明细
     * @returns 
     */
    async batchesTransfer(outBatchNo: string, batchName: string, batchRemark: string, transferDetail: TransferDetailDto[]): Promise<any> {
        const pay = await this.init();
        if (transferDetail.length < 1) {
            throw new Error("至少一条提现明细");
        }
        let total_amount: number = 0;
        transferDetail.forEach(td => {
            // TODO:解决姓名加密问题
            if (td.transfer_amount / 100 >= 2000) {
                throw new Error('单笔提现金额需小于2000元');
            }
            total_amount += Number(td.transfer_amount);
        })
        const total_num = transferDetail.length;
        const result = await pay.batches_transfer({
            out_batch_no: outBatchNo,
            batch_name: batchName,
            batch_remark: batchRemark,
            total_amount,
            total_num,
            transfer_detail_list: transferDetail,
        });
        this.logger.log('发起提现', result);
        return result;
    }
    /**
     * 会员提现
     * @returns 
     */
    async withdrawal(memberUUID: string, money: number, req: any): Promise<any> {
        const withdrawalNo = uuidV4().replace(/-/g, '').toUpperCase();
        const transferDetailDto = new TransferDetailDto();
        transferDetailDto.openid = req.user.openId;
        transferDetailDto.out_detail_no = withdrawalNo;
        transferDetailDto.transfer_amount = money;
        transferDetailDto.transfer_remark = `会员发起提现`;
        // transferDetailDto.user_name = req.user.userName;
        const res = await this.batchesTransfer(withdrawalNo, '会员提现', `${req.user.openId}`, [transferDetailDto]);
        return res;
    }
    /**
     * 根据回调参数resource的子参数或平台证书encrypt_certificate的子参数来对回调数据进行解密
     * @param ciphertext 数据密文
     * @param associated_data 附加数据
     * @param nonce 随机串
     * @returns 
     */
    async decipherGcm(ciphertext: string, associated_data: string, nonce: string): Promise<any> {
        const pay = await this.init();
        const result = pay.decipher_gcm(ciphertext, associated_data, nonce, this.payConfig[DC0005.APIv3密钥]);
        this.logger.log('解密结果', result);
        return result;
    }
}

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberManagementService } from '../member-management/member-management.service';
import { readFileSync } from 'fs';
import { SystemConfigService } from '../system-config/system-config.service';
import { TransferDetailDto } from './dto/transfer-detail.dto';
import { v4 as uuidV4 } from 'uuid';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { LOGIN_QR_STATUS, TRANSFER_SCENE_ID } from './dto/enum.dto';
import { DC0005 } from 'src/data-dictionary/dic-enum';
import { CONF_TYPE } from 'src/system-config/dto/system-config.schema';
import { PayResDto } from './dto/payRes.dto';
import { TransferToChangeResultDto } from './dto/transfer-to-change-result.dto';
import { UUID } from 'src/utils/random-tools';
import { removeNonUtf8Chars } from 'src/utils/common-tools';
const WxPay = require('wechatpay-node-v3');
/**
 * 
 * 微信支付参考文档
 * https://github.com/klover2/wechatpay-node-v3-ts?tab=readme-ov-file
 */
@Injectable()
export class WeChatApiService {
    private readonly logger = new Logger(WeChatApiService.name);
    private payConfig: any;
    constructor(
        private fileUploadService: FileUploadService,
        private authService: AuthService,
        private memberManagementService: MemberManagementService,
        private systemConfigService: SystemConfigService,
        private transaction: TransactionHelper,
        private redisCacheService: RedisCacheService,

    ) {

    };
    async init() {
        this.payConfig = await this.systemConfigService.getConfigObjByConfType(CONF_TYPE.支付参数设置);
        if (!this.payConfig[DC0005.api证书] || !this.payConfig[DC0005.api密钥]) {
            throw new Error("请上传api证书和api密钥");
        }
        const publicKeyPath: string = JSON.parse(this.payConfig[DC0005.api证书]).path;
        const privateKeyPath: string = JSON.parse(this.payConfig[DC0005.api密钥]).path;
        if (publicKeyPath && privateKeyPath) {
            return new WxPay({
                appid: this.payConfig[DC0005.应用appid],
                mchid: this.payConfig[DC0005.商户号mchid],
                publicKey: readFileSync(publicKeyPath),
                privateKey: readFileSync(privateKeyPath),
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
        await this.memberManagementService.setMemberQR(memberId, QRFile.url, QRFile._id);
        return QRFile.url;
    }
    async getQR(scene: string, openId: string, page: string, tow = false): Promise<any> {
        const access_token = await this.authService.getAccessToken(openId, tow);
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
            /**
             * 尝试2次
             */
            if (tow) {
                throw new Error(`${resJson.errcode}-${resJson.errmsg}`);
            } else {
                // 重置access_token后再尝试一次
                return await this.getQR(scene, openId, page, true);
            }
        }
        return `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
    }
    async createLoginQR(page: string): Promise<LoginQrDto> {
        const access_token = await this.authService.getAccessToken();
        const loginId = `${UUID()}`.toLowerCase().substring(0, 16);
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
    async jsapiPay(memberOpenId: string, orderNo: string, orderDescription: string, money: number, notify_url?: string): Promise<any> {
        const pay = await this.init();
        console.log({ notify_url })
        const params = {
            description: removeNonUtf8Chars(orderDescription).substring(0, 127),
            out_trade_no: orderNo,
            notify_url: notify_url,
            amount: {
                total: Number(money),
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
        if (result.message) {
            throw Error(result.message);
        }
        return result;
    }
    /**
     * 查询支付结果
     * @param out_trade_no 
     */
    async queryPayOrder(out_trade_no: string): Promise<PayResDto> {
        const pay = await this.init();
        const result: PayResDto = await pay.query({ out_trade_no });
        console.log('支付结果查询', { result });
        return new PayResDto(result);
    }
    /**
     * 关闭支付订单
     * 商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；
     * 系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
     * @param out_trade_no 
     */
    async closePayOrder(out_trade_no: string) {
        const pay = await this.init();
        const res = await pay.close(out_trade_no);
        this.logger.warn('支付订单取消', out_trade_no, res);
    }

    /**
     * 订单退款
     * @param id 
     * @param refundsCause 
     * @param req 
     * @param isWallet 是否仅为解除钱包冻结资金
     */
    async refundsOrder(id: string, refundsCause: string, req?: any, isWallet?: Boolean): Promise<any> {
        let refundsNo = `${UUID()}`.toUpperCase();
        const { message } = await this.refunds("orderNo", refundsNo, refundsCause, 10, 10);
        // return this.OrderManagementModel.updateOne({ orderNo: orderNo }, { orderStatus, refundId, refundContent });
    }
    /**
     * 退款
     * @param orderNo 订单号：支付的时候使用的订单号
     * @param refundNo 退款单号：系统内部生成
     * @param reason 退款原因
     * @param refund 退款金额
     * @param total 原订单金额
     * @returns 
     */
    async refunds(orderNo: string, refundNo: string, reason: string, refund: number, total: number, notify_url?: string): Promise<any> {
        const pay = await this.init();
        const params = {
            out_trade_no: orderNo,
            out_refund_no: refundNo,
            reason: removeNonUtf8Chars(reason),
            notify_url: notify_url ?? this.payConfig[DC0005.退款回调地址],
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
        return result;
    }
    /**
     * 转账到零钱
     * 微信支付文档
     * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter4_3_1.shtml
     * nodeApi文档
     * https://github.com/klover2/wechatpay-node-v3-ts/blob/master/docs/batches_transfer.md
     * @param outBatchNo 转账批次编号
     * @param batchName 转账批次名称
     * @param batchRemark 转账批次备注
     * @param transferDetail 转账明细
     * @param transfer_scene_id 转账场景ID
     * @returns 
     */
    async batchesTransfer(outBatchNo: string, batchName: string, batchRemark: string, transferDetail: TransferDetailDto[], transfer_scene_id: TRANSFER_SCENE_ID = TRANSFER_SCENE_ID.分销返佣): Promise<TransferToChangeResultDto> {
        const pay = await this.init();
        // TODO:增加定时器去维护这个微信平台公钥证书
        // 使用最新的平台证书（即：证书启用时间较晚的证书）
        const certificates = await pay.get_certificates(this.payConfig[DC0005.APIv3密钥]);
        const certificate = certificates.pop();
        if (transferDetail.length < 1) {
            throw new Error("至少一条提现明细");
        }
        if (transferDetail.length > 1) {
            throw new Error("最多一条提现明细");
        }
        let total_amount: number = 0;
        const wx_serial_no = certificate.serial_no;
        transferDetail.forEach(td => {
            if (td.user_name) {
                // 解决姓名加密问题后，最大金额可以大于2000元
                td.user_name = pay.publicEncrypt(td.user_name, Buffer.from(certificate.publicKey));
            } else {
                if (td.transfer_amount / 100 >= 2000) {
                    throw new Error('单笔提现金额需小于2000元');
                }
            }
            total_amount += Number(td.transfer_amount);
        })
        const total_num = transferDetail.length;
        const result = await pay.batches_transfer({
            out_batch_no: outBatchNo,
            batch_name: removeNonUtf8Chars(batchName).substring(0, 32),
            batch_remark: removeNonUtf8Chars(batchRemark).substring(0, 32),
            total_amount,
            wx_serial_no,
            total_num,
            transfer_detail_list: transferDetail,
            transfer_scene_id
        });
        console.log('转账结果', { result });
        if (result.status == 400) {
            const resDto = new TransferToChangeResultDto();
            resDto.success = false;
            resDto.resultStr = result;
            resDto.message = JSON.parse(result.error).message
            return resDto;
        }
        // 转账申请后需要查询确定转账结果；
        const queryResults = () => new Promise<any>(async (res, rej) => {
            const getTransferResult = async () => {
                let results = await pay.query_batches_transfer_detail(
                    {
                        out_batch_no: outBatchNo,
                        out_detail_no: transferDetail[0].out_detail_no
                    }
                );
                if (typeof results == 'string') {
                    results = JSON.parse(results);
                }
                console.log('查询转账结果', { results });
                if (results.data && ['SUCCESS', 'FAIL'].includes(results.data.detail_status)) {
                    res(results.data);
                } else {
                    // 3秒后再次查询
                    setTimeout(async () => {
                        await getTransferResult();
                    }, 3 * 1000);
                }
            };
            try {
                await getTransferResult();
            } catch (e) {
                rej(e);
            }
        })
        const queryTransferResults = await queryResults();
        return new TransferToChangeResultDto(queryTransferResults);
    }
    /**
     * 会员提现
     * @returns 
     */
    async withdrawal(memberUUID: string, money: number, req: any): Promise<any> {
        const withdrawalNo = UUID().toUpperCase();
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

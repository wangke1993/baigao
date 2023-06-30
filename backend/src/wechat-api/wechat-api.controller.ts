import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { SystemLogService } from 'src/system-log/system-log.service';
import { LOGIN_QR_STATUS, REFUND_STATUS, TRADE_STATE } from './dto/enum.dto';
import { WeChatApiService } from './wechat-api.service';

@ApiTags('微信相关API')
@Controller('wechat')
export class WeChatApiController {
    private readonly logger = new Logger(WeChatApiController.name);
    constructor(
        private weChatApiService: WeChatApiService,
        private systemLogService: SystemLogService,
        private redisCacheService: RedisCacheService
    ) { };
    @Get('createQRUrl')
    @AuthTag('createQRUrl')
    @ApiOperation({ description: 'createQRUrl:创建用户二维码,startPage:启动页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async createQRUrl(@Query('startPage') startPage: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const rsp = new ResponseInfoDto<string>();
        try {
            rsp.success('生成成功', await this.weChatApiService.createQR(req.user?.openId, req.user?._id, startPage));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @AuthTag("createWeChatQR")
    @ApiOperation({ description: 'createWeChatQR:query: { page: string, scene: string }根据参数生成太阳码' })
    @Get("createWeChatQR")
    @UseGuards(JwtAuthGuard, PowerGuard)
    async createWeChatQR(@Query('page') page: string, @Query('scene') scene: string, @Req() req: any): Promise<any> {
        return await this.weChatApiService.getQR(scene, req.user.openId, page);
    }
    @Get('createLoginQRUrl')
    @ApiOperation({ description: '获取登录小程序登录码' })
    async createLoginQRUrl(@Query('page') page: string): Promise<ResponseInfoDto<LoginQrDto>> {
        const rsp = new ResponseInfoDto<LoginQrDto>();
        try {
            rsp.success('生成成功', await this.weChatApiService.createLoginQR(page));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('changeQRStatusToSCAN')
    @ApiOperation({ description: '变更扫码状态到已扫码' })
    async changeQRStatusToSCAN(@Query('loginKey') loginKey: string): Promise<ResponseInfoDto<String>> {
        const rsp = new ResponseInfoDto<String>();
        try {
            rsp.success('变更成功', await this.redisCacheService.set(loginKey, LOGIN_QR_STATUS.已扫码));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('checkLoginQr/:QRKey')
    @ApiOperation({ description: '查询扫码状态及授权结果' })
    async checkLoginQr(@Param('QRKey') QRKey: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        return new ResponseInfoDto<String>().success('微信扫码授权登录成功', await this.redisCacheService.get(QRKey));
    }
    @Get('orderPay/:orderId')
    @AuthTag('orderPay')
    @ApiOperation({ description: 'orderPay:订单支付' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async orderPay(@Param('orderId') orderId: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const rsp = new ResponseInfoDto<string>();
        try {
            const res = await this.weChatApiService.jsapiPay(req.user.openId, "", "", 10);
            const { message } = res;
            if (message) {
                rsp.warring(message);
            } else {
                rsp.success('获取支付参数成功', res);
            }
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('payNotifyUrl')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: '订单支付回调' })
    async payNotifyUrl(@Body() data: any): Promise<any> {
        try {
            // this.logger.log('收到支付结果通知', data);
            const { resource } = data;
            if (resource) {
                const { ciphertext, associated_data, nonce } = resource;
                const res = await this.weChatApiService.decipherGcm(ciphertext, associated_data, nonce);
                // this.logger.log('通知解密', res);
                const { out_trade_no, trade_state, transaction_id } = res;
                if (trade_state == TRADE_STATE.支付成功) {
                    this.logger.log(`订单${out_trade_no}支付成功`, transaction_id);
                } else {
                    this.logger.log(`订单${out_trade_no}支付失败`);
                }
                return null;
            } else {
                throw new HttpException({
                    "code": "FAIL",
                    "message": "失败"
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (e) {
            this.logger.log('通知接收异常', e);
            throw new HttpException({
                "code": "FAIL",
                "message": "失败"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get('orderRefunds/:id')
    @AuthTag('orderRefunds')
    @ApiOperation({ description: 'orderRefunds:管理员操作退款:id:订单id,refundsCause:退款原因' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async orderRefunds(@Param("id") id: string, @Query('refundsCause') refundsCause: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('订单退款', await this.weChatApiService.refundsOrder(id, refundsCause, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('订单管理', `订单退款,${rsp.message},,id:${id}`, req);
        return rsp;
    }
    @Get("withdrawal/:money")
    @AuthTag('withdrawal')
    @ApiOperation({ description: 'withdrawal:会员提现' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async withdrawal(@Param('money') money: number, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>();
        try {
            info.success(`成功`, await this.weChatApiService.withdrawal(req.user?.UUID, money, req));
        } catch (e) {
            info.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `会员提现,${JSON.stringify(req.user?.openId)},${money},${info.message}`, req);
        return info;
    }
    @Post('refundsNotifyUrl')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: '订单退款回调' })
    async refundsNotifyUrl(@Body() data: any, @Req() req: any): Promise<any> {
        try {
            // this.logger.log('收到退款结果通知', data);
            const { resource } = data;
            if (resource) {
                const { ciphertext, associated_data, nonce } = resource;
                const res = await this.weChatApiService.decipherGcm(ciphertext, associated_data, nonce);
                // this.logger.log('通知解密', res);
                const { out_trade_no, refund_status, refund_id } = res;
                if (refund_status == REFUND_STATUS.退款成功) {
                    this.logger.log(`订单${out_trade_no}退款成功`);
                } else {
                    this.logger.log(`订单${out_trade_no}退款失败`);
                }
                return null;
            } else {
                throw new HttpException({
                    "code": "FAIL",
                    "message": "失败"
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (e) {
            this.logger.log('通知接收异常', e);
            throw new HttpException({
                "code": "FAIL",
                "message": "失败"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

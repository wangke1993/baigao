import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { SmsApiService } from './sms-api.service';
import { SMS_TPL } from './dto/sms-tpl.enum';
import { randomNumber } from 'src/utils/random-tools';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@ApiTags('短信相关')
@Controller('SMS')
export class SMSController {
    constructor(
        private smsApiService: SmsApiService,
        private redisCacheService: RedisCacheService

    ) { };

    // @Get("sendMSM")
    // @ApiOperation({ description: '发送短信测试' })
    // async sendMSM(@Req() req:any): Promise<ResponseInfoDto<any>> {
    //     const info = new ResponseInfoDto<any>(req);
    //     try {
    //         info.success(`成功`, await this.smsApiService.sendMSM('17612702450', '8e107566', { code: '123456' }));
    //     } catch (e) {
    //         info.warring(e.toString());
    //     }
    //     return info;
    // }
    @Get("sendCode/:phone")
    @ApiOperation({ description: '发送验证码' })
    @UseGuards(JwtAuthGuard)
    async sendCode(@Param('phone') phone: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            const delayKey = `${phone}delay`;
            const delay = await this.redisCacheService.get(delayKey);
            if (delay) {
                throw new Error(`${await this.redisCacheService.getRemainingTime(delayKey)}s后再试`);
            }
            const code = randomNumber(1000, 9999);
            await this.smsApiService.send([phone], SMS_TPL.验证码, { code }, req);
            // 同一个手机号，60s才允许发送第二次
            await this.redisCacheService.set(delayKey, code, 60);
            // 发送后10分钟内有效
            await this.redisCacheService.set(phone, code, 60 * 10);
            info.success(`发送成功，10分钟内有效`);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("verifyPhoneNumber/:phone/:code")
    @ApiOperation({ description: '验证手机号验证码' })
    @UseGuards(JwtAuthGuard)
    async verifyPhoneNumber(@Param('phone') phone: string, @Param('code') code: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            const serviceCode = await this.redisCacheService.get(phone);
            if (code != serviceCode) {
                throw new Error("验证码错误");
            }
            await this.redisCacheService.del(phone);
            info.success(`验证通过`, true);
        } catch (e) {
            info.warring(e.toString(), false);
        }
        return info;
    }
}

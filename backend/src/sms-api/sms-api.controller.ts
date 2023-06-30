import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { SmsApiService } from './sms-api.service';

@ApiTags('短信相关')
@Controller('SMS')
export class SMSController {
    constructor(private smsApiService: SmsApiService) { };

    // @Get("sendMSM")
    // @ApiOperation({ description: '发送短信测试' })
    // async sendMSM(): Promise<ResponseInfoDto<any>> {
    //     const info = new ResponseInfoDto<any>();
    //     try {
    //         info.success(`成功`, await this.smsApiService.sendMSM('17612702450', '8e107566', { code: '123456' }));
    //     } catch (e) {
    //         info.warring(e.toString());
    //     }
    //     return info;
    // }
}

import { Module } from '@nestjs/common';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { SMSController } from './sms-api.controller';
import { SmsApiService } from './sms-api.service';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
    imports: [SystemLogModule, SystemConfigModule, RedisCacheModule],
    providers: [SmsApiService],
    exports: [SmsApiService],
    controllers: [SMSController]
})
export class SmsApiModule { }

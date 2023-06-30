import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { MemberMangerModule } from '../member-manger/member-manger.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { WeChatApiController } from './wechat-api.controller';
import { WeChatApiService } from './wechat-api.service';

@Module({
    imports: [
        TransactionModule,
        SystemLogModule,
        FileUploadModule,
        AuthModule,
        MemberMangerModule,
        RedisCacheModule,
        SystemConfigModule],
    providers: [WeChatApiService],
    exports: [WeChatApiService],
    controllers: [WeChatApiController]
})
export class WeChatApiModule { }

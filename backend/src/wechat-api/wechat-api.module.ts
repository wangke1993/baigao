import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { MemberManagementModule } from '../member-management/member-management.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { WeChatApiController } from './wechat-api.controller';
import { WeChatApiService } from './wechat-api.service';
import { WSModule } from 'src/web-socket/ws.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WxMpUser, WxMpUserSchema } from './dto/wx-mp-user.schema';
import { WxMpUserService } from './wx-mp-user.service';
import { WxMPApiService } from './wx-mp-api.service';
import { WxTaskService } from './wx-task.service';
import { TaskManagementModule } from 'src/task-management/task-management.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: WxMpUser.name, schema: WxMpUserSchema }]),
        TransactionModule,
        SystemLogModule,
        FileUploadModule,
        AuthModule,
        MemberManagementModule,
        RedisCacheModule,
        SystemConfigModule,
        WSModule
    ],
    providers: [WeChatApiService, WxTaskService, WxMpUserService, WxMPApiService],
    exports: [WeChatApiService, WxTaskService, WxMpUserService, WxMPApiService],
    controllers: [WeChatApiController]
})
export class WeChatApiModule { }

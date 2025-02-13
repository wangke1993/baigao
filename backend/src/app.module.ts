import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from './system-log/system-log.module';
import { AdminMenuModule } from './admin-menu/admin-menu.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { DataDictionaryModule } from './data-dictionary/data-dictionary.module';
import { AdministrativeDivisionsModule } from './administrative-divisions/administrative-divisions.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ArticleManagementModule } from './article-management/article-management.module';
import { AdManagementModule } from './ad-management/ad-management.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { MemberManagementModule } from './member-management/member-management.module';
import { WeChatApiModule } from './wechat-api/wechat-api.module';
import { SmsApiModule } from './sms-api/sms-api.module';
import { TreeClassificationModule } from './tree-classification/tree-classification.module';
import { MulterModule } from '@nestjs/platform-express';
import { SystemDevModule } from './system-dev/system-dev.module';
import { EnvConfig } from './utils/env-config';
import { TaskManagementModule } from './task-management/task-management.module';
import { TaskRunModule } from './task-management/task-run.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WSModule } from './web-socket/ws.module';
import { WithdrawalManagementModule } from './withdrawal-management/withdrawal-management.module';
import { BullTaskModule } from './task-management/bull-task.module';
const envConfig = new EnvConfig();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MulterModule.register({
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB 允许上传最大文件大小
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRES_IN },
    }),
    MongooseModule.forRoot(envConfig.MONGO_DB, {
      keepAlive: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 0,
      useNewUrlParser: true,
    }),
    BullTaskModule,
    RedisCacheModule,
    WSModule,
    AuthModule,
    SystemLogModule,
    AdminMenuModule,
    RolePermissionsModule,
    AdminUserModule,
    DataDictionaryModule,
    AdministrativeDivisionsModule,
    FileUploadModule,
    ArticleManagementModule,
    AdManagementModule,
    SystemConfigModule,
    MemberManagementModule,
    WeChatApiModule,
    SmsApiModule,
    TreeClassificationModule,
    SystemDevModule,
    // TaskManagementModule,
    TaskRunModule,
    WithdrawalManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {

  }
}


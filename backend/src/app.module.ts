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
import { ArticleMangerModule } from './article-manger/article-manger.module';
import { AdMangerModule } from './ad-manger/ad-manger.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { MemberMangerModule } from './member-manger/member-manger.module';
import { WeChatApiModule } from './wechat-api/wechat-api.module';
import { SmsApiModule } from './sms-api/sms-api.module';
import { DelayTaskModule } from './delay-task/delay-task.module';
import { CreateDelayTaskModule } from './delay-task/create-delay-task.module';
import { TreeClassificationModule } from './tree-classification/tree-classification.module';
import { MulterModule } from '@nestjs/platform-express';
import { SystemDevModule } from './system-dev/system-dev.module';
import { StudentMangerModule } from './temp/student-manger/student-manger.module';
const configService = new ConfigService();
@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB 允许上传最大文件大小
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },  //s,m,h,d
    }),
    MongooseModule.forRoot(configService.get<string>('MONGO_DB'), {
      keepAlive: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 0,
      useNewUrlParser: true,
    }),
    RedisCacheModule,
    AuthModule,
    SystemLogModule,
    AdminMenuModule,
    RolePermissionsModule,
    AdminUserModule,
    DataDictionaryModule,
    AdministrativeDivisionsModule,
    FileUploadModule,
    ArticleMangerModule,
    AdMangerModule,
    SystemConfigModule,
    MemberMangerModule,
    WeChatApiModule,
    SmsApiModule,
    // DelayTaskModule,
    // CreateDelayTaskModule,
    TreeClassificationModule,
    SystemDevModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}


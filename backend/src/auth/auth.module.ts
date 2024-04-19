import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AdminUserModule } from 'src/admin-user/admin-user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './strategy/jwt.strategy';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';
import { AdminMenuModule } from 'src/admin-menu/admin-menu.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { SystemConfigModule } from 'src/system-config/system-config.module';
import { MemberManagementModule } from 'src/member-management/member-management.module';
import { EnvConfig } from 'src/utils/env-config';
const envConfig = new EnvConfig;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: envConfig.JWT_EXPIRES_IN },  //s,m,h,d
    }),
    AdminUserModule,
    RolePermissionsModule,
    AdminMenuModule,
    PassportModule,
    SystemLogModule,
    RedisCacheModule,
    SystemConfigModule,
    MemberManagementModule],
  providers: [AuthService, jwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }

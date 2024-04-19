import { Module } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from './dto/admin-user.schema';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }]),
    SystemLogModule
  ],
  providers: [AdminUserService],
  exports: [AdminUserService],
  controllers: [AdminUserController]
})
export class AdminUserModule { }

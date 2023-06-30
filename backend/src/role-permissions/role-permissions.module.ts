import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserModule } from 'src/admin-user/admin-user.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { RolePermissions, RolePermissionsSchema } from './dto/role-permissions.schema';
import { RolePermissionsController } from './role-permissions.controller';
import { RolePermissionsService } from './role-permissions.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: RolePermissions.name, schema: RolePermissionsSchema }]), SystemLogModule, AdminUserModule],
    providers: [RolePermissionsService],
    exports: [RolePermissionsService],
    controllers: [RolePermissionsController]
})
export class RolePermissionsModule { }

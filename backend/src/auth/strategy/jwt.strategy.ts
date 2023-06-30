import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AdminMenuService } from 'src/admin-menu/admin-menu.service';
import { RolePermissionsService } from 'src/role-permissions/role-permissions.service';
import { AdminUser } from 'src/admin-user/dto/admin-user.schema';
import { AdminUserCache } from '../dto/admin-user-cache.dto';

//jwt权限验证
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'AdminJwt') {
  constructor(
    private readonly adminMenuService: AdminMenuService,
    private readonly rolePermissionsService: RolePermissionsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    const user: any = JSON.parse(Buffer.from(payload.userInfo, 'base64').toString('utf-8'));
    const isSuper = await this.rolePermissionsService.isSuperByIds(user.role);
    if (isSuper) {
      user.menuPowerTagList = await this.adminMenuService.getAllMenuPowerTagList();
    } else {
      user.menuIds = await this.rolePermissionsService.getRolePermissionsListByIds(user.role);
      user.menuPowerTagList = await this.adminMenuService.getMenuPowerTagListByIds(user.menuIds);
    }
    return user;
  }
}
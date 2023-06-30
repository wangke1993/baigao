import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

//接口权限验证
@Injectable()
export class PowerGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const roles = this.reflector.get<string[]>('AuthTag', context.getHandler());
        const user: any = request.user;
        if (roles) {
            if (user.menuPowerTagList.includes(roles[0])) {
                return true;
            }
        }
        return false;
    }
}
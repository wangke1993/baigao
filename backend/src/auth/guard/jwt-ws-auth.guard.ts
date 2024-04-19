import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verify } from "jsonwebtoken";
import { EnvConfig } from "src/utils/env-config";
/**
 * ws权限校验
 */
@Injectable()
export class JwtWsAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const { query } = client.handshake;
        const envConfig = new EnvConfig();
        try {
            const toke = query.Authorization.replace('Bearer ', "");
            const res = verify(toke, envConfig.JWT_SECRET);
            if (res) {
                return true;
            } else {
                client.emit('message', '请登录');
                client.disconnect(true);
                return false;
            }
        } catch (error) {
            client.emit('message', error);
            client.disconnect(true);
            return false;
        }
    }
}
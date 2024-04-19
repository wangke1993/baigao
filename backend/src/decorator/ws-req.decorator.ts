import { verify } from "jsonwebtoken";
import { EnvConfig } from "src/utils/env-config";
/**
 * 入参末尾注入req参数，里面包含user信息
 * @returns 
 */
export const WSReq = () => {
    const envConfig = new EnvConfig();
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            // 客户端发送数据时，socket是第二个参数
            let client = args[1];
            if (!client?.handshake) {
                // 客户端连接时socket是第一个参数
                client = args[0]
            }
            const { query } = client.handshake;
            try {
                const toke = query.Authorization.replace('Bearer ', "");
                const res = verify(toke, envConfig.JWT_SECRET);
                if (res) {
                    const user = JSON.parse(Buffer.from(res["userInfo"], 'base64').toString());
                    // 为所有处理器最后一个参数添加为req：{user};
                    return originalMethod.apply(this, args.concat([{ user }]));
                } else {
                    return;
                }
            } catch (error) {
                return;
            }
        };
        return descriptor;
    };
};
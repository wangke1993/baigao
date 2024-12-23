import { HmacSHA1 } from "crypto-js";
import { EnvConfig } from "./env-config"

/**
 * 根据配置的salt对字符串进行sha1加密
 * @param str
 * @returns
 */
export const encryption = (str: string) => {
    const salt = new EnvConfig().SALT_CODE;
    return HmacSHA1(str, salt).toString();
}
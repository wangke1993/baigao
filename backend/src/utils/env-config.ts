import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
export class EnvConfig {
    /**
     * JWT加密密钥
     */
    get JWT_SECRET(): string {
        return configService.get<string>('JWT_SECRET')
    }
    /**
     * JWT过期时间
     * s秒,m分钟,h小时,d天
     * 例如：24h
     */
    get JWT_EXPIRES_IN(): string {
        return configService.get<string>('JWT_EXPIRES_IN')
    }
    /**
     * mongo数据库配置
     */
    get MONGO_DB(): string {
        return configService.get<string>('MONGO_DB')
    }
    /**
     * redis连接地址
     */
    get REDIS_HOST(): string {
        return configService.get<string>('REDIS_HOST')
    }
    /**
     * redis连接端口
     */
    get REDIS_LINK_PORT(): string {
        return configService.get<string>('REDIS_LINK_PORT')
    }
    /**
     * redis连接密码
     */
    get REDIS_PASSWD(): string {
        return configService.get<string>('REDIS_PASSWD')
    }
    /**
     * redis连接库
     */
    get REDIS_DB(): string {
        return configService.get<string>('REDIS_DB')
    }
    /**
     * redis存储键前缀
     */
    get REDIS_KEY(): string {
        return configService.get<string>('REDIS_KEY')
    }
    /**
     * 用户密码加密盐值
     */
    get SALT_CODE(): string {
        return configService.get<string>('SALT_CODE')
    }
    /**
     * Rabbit连接地址
     */
    get RABBIT_URL(): string {
        return configService.get<string>('RABBIT_URL')
    }
    /**
     * 百度翻译APPID
     */
    get BAIDU_TRANSLATE_APPID(): string {
        return configService.get<string>('BAIDU_TRANSLATE_APPID')
    }
    /**
     * 百度翻译SECRET_KEY
     */
    get BAIDU_TRANSLATE_KEY(): string {
        return configService.get<string>('BAIDU_TRANSLATE_KEY')
    }
    /**
     * 百度云APP_ID
     */
    get BAIDU_APP_ID(): string {
        return configService.get<string>('BAIDU_APP_ID')
    }
    /**
     * 百度云API_KEY
     */
    get BAIDU_API_KEY(): string {
        return configService.get<string>('BAIDU_API_KEY')
    }
    /**
     * 百度云SECRET_KEY
     */
    get BAIDU_SECRET_KEY(): string {
        return configService.get<string>('BAIDU_SECRET_KEY')
    }
    
}
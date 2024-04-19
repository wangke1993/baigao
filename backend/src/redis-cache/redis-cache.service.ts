import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvConfig } from 'src/utils/env-config';
const config = new EnvConfig()
@Injectable()
export class RedisCacheService {
    private client: Redis;
    /**
     * redis唯一标识前缀
     */
    private REDIS_KEY: string;

    constructor() {
        this.getClient();
        this.REDIS_KEY = config.REDIS_KEY;
    }
    /**
     * 获取redis客户端
     */
    private async getClient() {
        this.client = new Redis({
            port: Number(config.REDIS_LINK_PORT),
            host: config.REDIS_HOST,
            password: config.REDIS_PASSWD,
            db: Number(config.REDIS_DB)
        });
    }
    /**
     * 创建一个缓存,如果原有缓存存在过期时间，则自动沿用剩余过期时间
     * @param key 键
     * @param value 值
     * @param seconds 过期时间，s
     * @param cover 覆盖之前的时间，默认沿用之前的剩余时间
     */
    async set(key: string, value: any, seconds?: number): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        if (!seconds) {
            const ttl = await this.client.ttl(this.REDIS_KEY + key);
            if (ttl > 0) {
                await this.client.set(this.REDIS_KEY + key, value, 'EX', ttl);
                return ttl;
            } else {
                await this.client.set(this.REDIS_KEY + key, value);
            }
        } else {
            await this.client.set(this.REDIS_KEY + key, value, 'EX', seconds);
        }
    }
    /**
     * 获取过期剩余时间
     * @param key 
     * @returns 剩余秒
     */
    async getRemainingTime(key: string): Promise<number> {
        return await this.client.ttl(this.REDIS_KEY + key);
    }
    /**
     * 获取redis缓存
     * @param key 键
     * @returns 
     */
    async get(key: string): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        let data = await this.client.get(this.REDIS_KEY + key)
        if (data) {
            return data;
        } else {
            return null;
        }
    }
    /**
     * 删除一条缓存
     * @param key 键
     */
    async del(key: string): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.del(this.REDIS_KEY + key);
    }
    /**
     * 清空缓存数据
     */
    async flushall(): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.flushall();
    }
}
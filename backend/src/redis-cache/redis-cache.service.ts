import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
    private client: Redis;
    /**
     * redis唯一标识前缀
     */
    private REDIS_KEY: string;

    constructor() {
        this.getClient();
        this.REDIS_KEY = process.env.REDIS_KEY;
    }
    /**
     * 获取redis客户端
     */
    private async getClient() {
        this.client = new Redis({
            port: Number(process.env.REDIS_LINK_PORT),
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWD,
            db: Number(process.env.REDIS_DB)
        });
    }
    /**
     * 创建一个缓存,如果原有缓存存在过期时间，则自动沿用剩余过期时间
     * @param key 键
     * @param value 值
     * @param seconds 过期时间，s
     */
    public async set(key: string, value: any, seconds?: number): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        if (!seconds) {
            const ttl = await this.client.ttl(this.REDIS_KEY + key);
            if (ttl > 0) {
                await this.client.set(this.REDIS_KEY + key, value, 'EX', ttl);
            } else {
                await this.client.set(this.REDIS_KEY + key, value);
            }
        } else {
            await this.client.set(this.REDIS_KEY + key, value, 'EX', seconds);
        }
    }
    /**
     * 获取redis缓存
     * @param key 键
     * @returns 
     */
    public async get(key: string): Promise<any> {
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
    public async del(key: string): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.del(this.REDIS_KEY + key);
    }
    /**
     * 情况缓存数据
     */
    public async flushall(): Promise<any> {
        if (!this.client) {
            await this.getClient();
        }
        await this.client.flushall();
    }
}
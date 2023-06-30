import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule { }
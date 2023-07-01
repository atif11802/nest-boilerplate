import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async RedisGet(key: string) {
    return await this.cacheManager.get(key);
  }

  async RedisSet(key: string, value: string | number, ttl?: number) {
    return await this.cacheManager.set(key, value, ttl);
  }
}

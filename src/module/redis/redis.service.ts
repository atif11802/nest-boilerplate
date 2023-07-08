import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Store) {}

  async RedisGet(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async RedisSet(key: string, value: string | number, ttl?: number) {
    return await this.cacheManager.set(key, value, { ttl } as any);
  }
}

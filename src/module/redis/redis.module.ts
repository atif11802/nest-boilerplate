import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

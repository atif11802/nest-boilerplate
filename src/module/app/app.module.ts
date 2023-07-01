import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'src/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { CatModule } from '../cat/cat.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/common/exception/global-error.filter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.register({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('dbUri'),
        dbName: configService.get('dbName'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CatModule,
    AuthModule,

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redisHost'),
        port: configService.get('redisPort'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}

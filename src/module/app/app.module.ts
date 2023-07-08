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
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface';
import { UtilsModule } from '../utils/utils.module';
import { UserOtpModule } from '../user-otp/user-otp.module';
@Module({
  imports: [
    ConfigModule.register({ isGlobal: true }),
    UtilsModule.forRoot({ isGlobal: true }),
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
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('redisHost'),
            port: +config.get('redisPort'),
          },
          password: config.get('redisPassword'),
          ttl: 60,
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
    UserOtpModule,
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

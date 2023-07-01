import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/model/User.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

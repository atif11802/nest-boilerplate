import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/User.schema';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { UserOtp, UserOtpSchema } from 'src/model/user-otp.schema';
import { UserOtpModule } from '../user-otp/user-otp.module';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: UserOtp.name,
        schema: UserOtpSchema,
      },
    ]),
    UserModule,
    UserOtpModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserOtpService } from './user-otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtp, UserOtpSchema } from 'src/model/user-otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserOtp.name,
        schema: UserOtpSchema,
      },
    ]),
  ],
  providers: [UserOtpService],
  exports: [UserOtpService],
})
export class UserOtpModule {}

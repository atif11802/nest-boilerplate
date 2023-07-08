import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserOtpDocument = HydratedDocument<UserOtp>;

@Schema()
export class UserOtp {
  @Prop()
  phoneOrEmail: string;

  @Prop()
  otp: string;

  @Prop()
  platform: string;

  @Prop({
    default: 0,
  })
  verify_attempt_count: number;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);

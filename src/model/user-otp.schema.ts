import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserOtpDocument = HydratedDocument<UserOtp>;

@Schema({
  timestamps: true,
})
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

  @Prop({
    default: false,
  })
  is_verified: boolean;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);

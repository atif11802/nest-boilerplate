import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserOtpDocument = HydratedDocument<UserOtp>;

@Schema()
export class UserOtp {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  password: string;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);

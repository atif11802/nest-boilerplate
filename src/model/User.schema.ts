import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  password: string;

  @Prop()
  phone_verified: boolean;

  @Prop()
  email_verified: boolean;

  @Prop()
  phone: string;

  @Prop({
    default: 'user',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

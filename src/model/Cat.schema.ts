import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './User.schema';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
  owner: User[];
}

export const CatSchema = SchemaFactory.createForClass(Cat);

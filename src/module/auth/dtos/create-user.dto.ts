import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  phone: string;
}

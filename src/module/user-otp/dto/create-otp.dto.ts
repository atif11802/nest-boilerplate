import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOtp {
  @IsString()
  phoneOrEmail: string;

  @IsNotEmpty()
  otp: string;
}

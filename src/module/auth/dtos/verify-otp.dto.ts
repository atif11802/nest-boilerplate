import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone_or_email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

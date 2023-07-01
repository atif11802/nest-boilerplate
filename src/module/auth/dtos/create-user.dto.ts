import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUser {
  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase() === 'true')
  is_admin: boolean;
}

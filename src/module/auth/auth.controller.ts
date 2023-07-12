import { Body, CacheTTL, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, VerifyOtpDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  @CacheTTL(30)
  async signUp(@Body() dto: CreateUser) {
    return this.authService.createUser(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}

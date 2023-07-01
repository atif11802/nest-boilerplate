import { Body, CacheTTL, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  @CacheTTL(30)
  async signUp(@Body() dto: CreateUser) {
    return this.authService.createUser(dto);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { GeneralApiResponse } from 'src/common/response/general-api-response';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private readonly RedisService: RedisService) {}

  async createUser(dto: CreateUser) {
    const otp = 123232;
    const isSaved = await this.RedisService.RedisGet(dto.phone);

    console.log(isSaved);

    if (isSaved) {
      return new GeneralApiResponse({
        msg: 'User already exists',
        data: isSaved,
      });
    }

    await this.RedisService.RedisSet(dto.phone, otp, 60 * 60 * 24);

    return new GeneralApiResponse({
      msg: 'User created successfully',
      data: null,
    });
  }
}

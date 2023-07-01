import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { GeneralApiResponse } from 'src/common/response/general-api-response';

import { UtilsService } from '../utils/utils.service';
import { UserHelper } from '../user/user.helper';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly RedisService: RedisService,
    private readonly UtilsService: UtilsService,
    private readonly UserHelper: UserHelper,
  ) {}

  async createUser(dto: CreateUser) {
    if (dto.email && dto.phone) {
      throw new BadRequestException(
        'You can only provide either email or phone',
      );
    }

    if (dto.email) {
      const validEmail = this.UtilsService.validateEmail(dto.email);

      if (!validEmail) {
        throw new BadRequestException('Invalid email');
      }
    }

    if (dto.phone) {
      const validPhone: boolean = this.UtilsService.getFormattedPhoneNumber(
        dto.phone,
      );

      if (!validPhone) {
        throw new BadRequestException('Invalid phone number');
      }
    }

    const otp: string = this.UtilsService.createOtp(dto.is_admin ? 10 : 6);

    console.log(otp);

    const userExists = await this.UserHelper.getUser({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    });

    const isSaved = await this.RedisService.RedisGet(dto.phone ?? dto.email);

    if (isSaved) {
      return new GeneralApiResponse({
        msg: `user already exists`,

        data: isSaved,
      });
    }
    await this.RedisService.RedisSet(dto.phone ?? dto.email, otp, 3 * 60);

    return new GeneralApiResponse({
      msg: `OTP sent to ${dto.phone ?? dto.email}`,
      data: null,
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { GeneralApiResponse } from 'src/common/response/general-api-response';

import { UtilsService } from '../utils/utils.service';
import { UserHelper } from '../user/user.helper';
import { RedisService } from '../redis/redis.service';
import { UserOtpService } from '../user-otp/user-otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly redis: RedisService,
    private readonly utils: UtilsService,
    private readonly userHelper: UserHelper,
    private readonly userOtpService: UserOtpService,
  ) {}

  async createUser(dto: CreateUser) {
    if (dto.email && dto.phone) {
      throw new BadRequestException(
        'You can only provide either email or phone',
      );
    }

    if (dto.email) {
      const validEmail = this.utils.validateEmail(dto.email);

      if (!validEmail) {
        throw new BadRequestException('Invalid email');
      }
    }

    if (dto.phone) {
      const validPhone: boolean = this.utils.getFormattedPhoneNumber(dto.phone);

      if (!validPhone) {
        throw new BadRequestException('Invalid phone number');
      }
    }

    const userExists = await this.userHelper.getUser({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    });

    if (userExists) {
      if (userExists.name) {
        return new GeneralApiResponse({
          msg: `user already exists`,
        });
      } else {
        return new GeneralApiResponse({
          msg: `user already exists,but no name`,
        });
      }
    }

    let otp: string;

    otp = this.utils.createOtp(dto.is_admin ? 10 : 6);

    const isSaved: string = await this.redis.RedisGet(dto.phone ?? dto.email);

    if (isSaved) {
      otp = isSaved;
    }

    await this.redis.RedisSet(dto.phone ?? dto.email, otp, 5 * 60);
    await this.userOtpService.createOtp({
      phoneOrEmail: dto.phone ?? dto.email,
      otp,
    });

    return new GeneralApiResponse({
      msg: `OTP sent to ${dto.phone ?? dto.email}`,
    });
  }
}

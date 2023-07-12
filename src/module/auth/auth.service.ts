import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { GeneralApiResponse } from 'src/common/response/general-api-response';
import { UtilsService } from '../utils/utils.service';
import { UserHelper } from '../user/user.helper';
import { RedisService } from '../redis/redis.service';
import { UserOtpService } from '../user-otp/user-otp.service';
import { CreateUser, VerifyOtpDto } from './dtos';

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

    let phone: string;
    if (dto.phone) {
      phone = this.utils.formatPhoneNumber(dto.phone);
    }

    const userExists = await this.userHelper.getUser({
      $or: [{ email: dto.email }, { phone: phone }],
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

    const isSaved: string = await this.redis.RedisGet(phone ?? dto.email);

    if (isSaved) {
      otp = isSaved;
    }
    const otpTried = await this.userOtpService.getUserOtpCount(
      phone ?? dto.email,
      new Date(new Date().setHours(new Date().getHours() - 1)),
    );

    if (otpTried?.attempts >= 5) {
      return new GeneralApiResponse({
        msg: 'Maximum otp attempts reached',
      });
    }

    await this.redis.RedisSet(phone ?? dto.email, otp, 5 * 60);
    await this.userOtpService.createOtp({
      phoneOrEmail: phone ?? dto.email,
      otp,
    });

    return new GeneralApiResponse({
      msg: `OTP sent to ${phone ?? dto.email}`,
    });
  }

  async verifyOtp(dto: VerifyOtpDto) {
    console.log(dto.phone_or_email);
    const { phone, email, error } = this.utils.isPhoneOrEmail(
      dto.phone_or_email,
    );

    console.log('phone', phone, 'email', email, 'error', error);

    if (error) {
      throw new BadRequestException(error);
    }

    if (email) {
      const validEmail = this.utils.validateEmail(email);

      if (!validEmail) {
        throw new BadRequestException('Invalid email');
      }
    }

    let validPhone: string;
    if (phone) {
      validPhone = this.utils.formatPhoneNumber(phone);
    }

    const userExists = await this.userHelper.getUser({
      $or: [{ email }, { validPhone }],
    });

    if (userExists) {
      throw new ConflictException(`User Exists with ${phone ?? email}`);
    }
  }
}

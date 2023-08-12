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
import { CreateUser, LoginDto, VerifyOtpDto } from './dtos';
import { ResponseStatus } from 'src/common/response/response-status.enum';
import * as jwt from 'jsonwebtoken';

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

    if (!dto.email && !dto.phone) {
      throw new BadRequestException('You must provide either email or phone');
    }

    let email = null;
    let phone = null;

    if (dto.email) {
      email = this.utils.validateEmail(dto.email);

      if (!email) {
        throw new BadRequestException('Invalid email');
      }
    }

    if (dto.phone) {
      phone = this.utils.getFormattedPhoneNumber(dto.phone);

      if (!phone) {
        throw new BadRequestException('Invalid phone number');
      }
    }

    const userFound = await this.userHelper.getUser(
      phone ? { phone } : { email },
    );

    if (userFound) {
      if (userFound.name) {
        return new GeneralApiResponse({
          msg: 'User exists',
          status: ResponseStatus.NAME_EXISTS,
        });
      } else {
        return new GeneralApiResponse({
          msg: 'User exists',
          status: ResponseStatus.NAME_NOT_EXISTS,
        });
      }
    }
    const msisdn = phone || email;

    let otp = this.utils.createOtp(6);

    const found = await this.redis.RedisGet(msisdn);

    if (found) {
      otp = found;
    } else {
      const from = new Date(new Date().setHours(new Date().getHours() - 1));
      const attempts = await this.userOtpService.getUserOtpCount({
        phoneOrEmail: msisdn,
        date: { $gte: from, $lte: new Date() },
      });

      if (attempts && attempts.attempts >= 10) {
        throw new BadRequestException("You've exceeded the OTP limit");
      }
    }

    await this.redis.RedisSet(msisdn, otp, 5 * 60);

    const otpFound = await this.userOtpService.findOne({
      phoneOrEmail: msisdn,
      otp,
    });

    if (!otpFound) {
      await this.userOtpService.createOtp({
        phoneOrEmail: msisdn,
        otp,
      });
    }

    if (phone) {
      console.log('OTP sent successfully to phone');
    } else {
      console.log('OTP sent successfully to email');
    }

    return new GeneralApiResponse({
      msg: 'OTP sent successfully',
      data: {
        otp,
      },
    });
  }

  async verifyOtp(dto: VerifyOtpDto) {
    let phone: string = null;
    let email_msisdn: string | boolean = null;

    if (!dto.phone && !dto.email) {
      throw new BadRequestException('Invalid phone number or email');
    }

    if (dto.phone && dto.email) {
      throw new BadRequestException(
        'You can only provide either email or phone',
      );
    }

    if (dto.phone) {
      phone = this.utils.getFormattedPhoneNumber(dto.phone);
    }

    if (dto.email) {
      email_msisdn = this.utils.validateEmail(dto.email);

      if (!email_msisdn) {
        throw new BadRequestException('Invalid email');
      }
    }
    const msisdn: any = phone || email_msisdn;

    const otpFound = await this.redis.RedisGet(msisdn);

    if (!otpFound) {
      throw new BadRequestException('OTP not found');
    }

    const getOtp = await this.userOtpService.findOne({
      phoneOrEmail: msisdn,
    });

    if (!getOtp) {
      throw new BadRequestException('OTP not found');
    }

    const updateOtp = await this.userOtpService.updateOtp(
      {
        phoneOrEmail: msisdn,
      },
      {
        verify_attempt_count: getOtp.verify_attempt_count + 1,
      },
    );

    if (!updateOtp) {
      throw new ConflictException('Failed to update OTP');
    }

    if (getOtp.verify_attempt_count >= 10) {
      await this.redis.RedisDel(msisdn);
      throw new BadRequestException("You've exceeded the OTP limit");
    }

    if (otpFound !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const userExists = await this.userHelper.getUser(
      dto.phone ? { phone: msisdn } : { email: msisdn },
    );

    let updatedUser = null;
    if (userExists) {
      updatedUser = await this.userHelper.updateUser(
        dto.phone ? { phone: msisdn } : { email: msisdn },
        dto.phone
          ? {
              phone_verified: true,
            }
          : { email_verified: true },
      );
    } else {
      updatedUser = await this.userHelper.createUser({
        phone: dto.phone ? msisdn : null,
        email: dto.email ? msisdn : null,
        phone_verified: dto.phone ? true : false,
        email_verified: dto.email ? true : false,
      });
    }

    this.redis.RedisDel(msisdn);

    this.userOtpService.updateOtp(
      { msisdn },
      {
        is_verified: true,
      },
    );

    const token = await this.generateJwtToken(updatedUser);

    return new GeneralApiResponse({
      msg: 'OTP verified successfully',
      data: token,
    });
  }

  async generateJwtToken(user: any) {
    const payload = {
      name: user.name,
      id: user._id,
      role: user.role,
    };

    const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600 * 24 * 30,
    });

    await this.redis.RedisSet(
      user._id.toString(),
      refreshToken,
      3600 * 24 * 30,
    );

    const token = {
      accessToken,
      refreshToken,
    };

    return new GeneralApiResponse({
      msg: 'User logged in successfully',
      data: {
        token,
      },
    });
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Invalid phone number or email');
    }

    if (dto.email && dto.phone) {
      throw new BadRequestException(
        'You can only provide either email or phone',
      );
    }

    let msisdn: string | boolean = null;

    if (dto.phone) {
      msisdn = this.utils.getFormattedPhoneNumber(dto.phone);
    }

    if (dto.email) {
      msisdn = this.utils.validateEmail(dto.email);
    }

    const user = await this.userHelper.getUser(
      dto.phone ? { phone: msisdn } : { email: msisdn },
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.name && !dto.name) {
      throw new BadRequestException('Please provide your name');
    }

    if (!user.password) {
      if (!dto.password) {
        throw new BadRequestException('Please provide a password');
      }
      const hashedPassword = await this.utils.hashPassword(dto.password);

      this.userHelper.updateUser(
        dto.phone ? { phone: msisdn } : { email: msisdn },
        {
          password: hashedPassword,
        },
      );
    }

    if (user.password) {
      if (!dto.password) {
        throw new BadRequestException('Please provide a password');
      }

      const passwordMatch = this.utils.comparePassword(
        dto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new BadRequestException('Invalid password');
      }
    }

    const updatedUser = await this.userHelper.updateUser(
      dto.phone ? { phone: msisdn } : { email: msisdn },
      {
        last_login: new Date(),
        name: dto.name,
      },
    );

    const token = await this.generateJwtToken(updatedUser);

    return new GeneralApiResponse({
      msg: 'User logged in successfully',
      data: token,
    });
  }
}

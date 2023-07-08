import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOtp } from './dto/create-otp.dto';
import { GeneralApiResponse } from 'src/common/response/general-api-response';
import { UserOtp } from 'src/model/user-otp.schema';

@Injectable()
export class UserOtpService {
  constructor(
    @InjectModel(UserOtp.name) private userOtpModel: Model<UserOtp>,
  ) {}
  async createOtp(dto: CreateOtp) {
    const user = await new this.userOtpModel(dto).save();

    if (user) {
      return new GeneralApiResponse({
        msg: 'OTP created successfully',
      });
    }

    return new GeneralApiResponse({
      msg: 'OTP created failed',
    });
  }

  findAll() {
    return `This action returns all yes`;
  }

  async getUserOtpCount(phoneOrEmail: string) {
    const pipeline = [
      {
        $match: {
          phone: phoneOrEmail,
        },
      },
      {
        $group: {
          _id: '$phone',
          attempts: {
            $sum: 1,
          },
        },
      },
    ];

    const result = await this.userOtpModel.aggregate(pipeline);

    if (!result) {
      return null;
    }

    return result[0];
  }

  findOne(id: number) {
    return `This action returns a #${id} yes`;
  }

  remove(id: number) {
    return `This action removes a #${id} yes`;
  }
}

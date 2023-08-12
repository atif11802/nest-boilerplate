import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOtp } from './dto/create-otp.dto';
import { GeneralApiResponse } from 'src/common/response/general-api-response';
import { UserOtp } from 'src/model/user-otp.schema';

interface getOtp {
  phoneOrEmail: string;
  _id: string;
  otp: string;
  verify_attempt_count: number;
}

@Injectable()
export class UserOtpService {
  constructor(
    @InjectModel(UserOtp.name) private userOtpModel: Model<UserOtp>,
  ) {}
  async createOtp(dto: CreateOtp) {
    const otp = await new this.userOtpModel(dto).save();

    if (otp) {
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

  async getUserOtpCount({
    phoneOrEmail,
    date,
  }: {
    phoneOrEmail: string;
    date: any;
  }) {
    const pipeline = [
      {
        $match: {
          phoneOrEmail: phoneOrEmail,
          createdAt: {
            $gte: date,
            $lte: new Date(),
          },
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

  async findOne(filter: any): Promise<null | getOtp> {
    const userOtp = await this.userOtpModel
      .findOne(filter)
      .sort({ _id: -1 })
      .limit(1);

    if (!userOtp) {
      return null;
    } else {
      return userOtp.toObject();
    }
  }

  async updateOtp(filter: any, update: any): Promise<boolean | getOtp> {
    const otpUpdated: any = await this.userOtpModel.updateOne(filter, update, {
      new: true,
    });

    if (otpUpdated) {
      return otpUpdated;
    } else {
      return false;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} yes`;
  }
}

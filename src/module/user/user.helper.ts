import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/User.schema';

@Injectable()
export class UserHelper {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(filter: { [key: string]: any }) {
    const found = await this.userModel.findOne(filter);

    if (!found) {
      return null;
    }

    return found;
  }

  async createUser(data: { [key: string]: any }) {
    const created = new this.userModel(data);
    await created.save();

    return created;
  }

  async updateUser(
    filter: { [key: string]: any },
    body: { [key: string]: any },
  ) {
    const updated = await this.userModel.findOneAndUpdate(filter, body, {
      new: true,
    });

    if (!updated) {
      return null;
    }

    return updated;
  }

  async deleteUser(filter: { [key: string]: any }) {
    const deleted = await this.userModel.findOneAndDelete(filter);

    if (!deleted) {
      return null;
    }

    return deleted;
  }
}

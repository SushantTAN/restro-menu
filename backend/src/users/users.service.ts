import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  // This is for seeding the database with an admin user
  async onModuleInit() {
    const adminUser = await this.findOne('admin');
    if (!adminUser) {
      const newAdmin = new this.userModel({ username: 'admin', password: 'admin' });
      await newAdmin.save();
    }
  }
}
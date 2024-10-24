import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  create(CreateUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(CreateUserDto);
    return newUser.save();
  }
  getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  findByEmailOrUsername(email: String, username: string): Promise<User> {
    return this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }
}

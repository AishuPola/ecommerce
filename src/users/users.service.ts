import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
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
  findByemail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
  findByEmailOrUsername(email: String, username: string): Promise<User> {
    return this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .exec();
  }

  // async findByEmail(email: string): Promise<User> {
  //   return this.userModel.findOne({ email }).exec();
  // }
  // async findByUsername(username: string): Promise<User> {
  //   return this.userModel.findOne({ username }).exec();
  // }
  async updateUser(id: string, UpdateUserDto: UpdateUserDto) {
    const updateuser = await this.userModel
      .findOneAndUpdate({ _id: id }, UpdateUserDto, { new: true })
      .exec();
    if (!updateuser) {
      throw new NotFoundException('User not found');
    }
    return updateuser;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}

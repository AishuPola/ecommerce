import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { UserProfileDto } from './dto/user-profile.dto';
@Injectable()
export class UsersService {
  private tempUserStore: Record<string, any> = {};
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

  async storeTemporaryUser(email: string, tempUserData: any) {
    this.tempUserStore[email] = tempUserData;
  }

  async getTemporaryUserByEmail(email: string) {
    return this.tempUserStore[email];
  }
  async update(id: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  //get user profile
  async getUserProfile(id: string): Promise<UserProfileDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { firstname, lastname, _id, ...rest } = user.toObject();
    const fullName = `${firstname} ${lastname}`;
    return {
      id: _id.toString(),
      ...rest,
      fullName,
    };
  }
  //update the user profile
  async updateUserProfile(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}

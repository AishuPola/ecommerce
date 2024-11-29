import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly UserService: UsersService,
    private S3Service: S3Service,
    private ConfigService: ConfigService,
  ) {}
  @Post()
  async create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.UserService.create(CreateUserDto);
  }
  @Get()
  async getUsers(): Promise<User[]> {
    return this.UserService.getUsers();
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.UserService.updateUser(id, UpdateUserDto);
  }

  // Get user profile
  @Get(':id/profile')
  async getProfile(@Param('id') userId: string) {
    return this.UserService.getUserProfile(userId);
  }

  @Put(':id/profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateData: Partial<any>,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    if (profilePicture) {
      const bucketName = this.ConfigService.get<string>('AWS_BUCKET_NAME');
      const key = `profile-pictures/${userId}-${Date.now()}-${profilePicture.originalname}`;
      const profilePictureUrl = await this.S3Service.UploadFile(
        bucketName,
        key,
        profilePicture,
      );
      updateData.profilePicture = profilePictureUrl;
    }
    return this.UserService.updateUserProfile(userId, updateData);
  }
}

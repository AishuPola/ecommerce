import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
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
}

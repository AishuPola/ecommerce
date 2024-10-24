import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  @Post()
  async create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.UserService.create(CreateUserDto);
  }
}

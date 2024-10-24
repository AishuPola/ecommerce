import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/schemas/user.schema';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

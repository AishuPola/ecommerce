import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('signup')
  async signup(@Body() SignUpDto: SignUpDto) {
    return this.authservice.signup(SignUpDto);
  }
  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    return this.authservice.login(LoginDto);
  }
}

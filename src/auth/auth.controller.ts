import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('signup')
  async signup(@Body() SignUpDto: SignUpDto) {
    return this.authservice.signup(SignUpDto);
  }
}

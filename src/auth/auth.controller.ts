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
  // @Post('verify-otp')
  // async verifyOtp(@Body() VerifyOtpDto: { email: string; otp: string }) {
  //   const { email, otp } = VerifyOtpDto;
  //   const isVerified = await this.authservice.verifyOtp(email, otp);
  //   return {
  //     message: isVerified
  //       ? 'OTP verfied successfully. User is now verified.'
  //       : 'OTP verification failed',
  //   };
  // }
  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authservice.verifyOtp(email, otp);
  }
}

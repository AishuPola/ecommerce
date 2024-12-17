import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
    private userService: UsersService,
  ) {}
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
  @Post('forgot-password')
  async requestPasswordReset(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByemail(email);
    if (!user) {
      throw new NotFoundException('No user found with the provided Email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    // Step 4: Send the reset link to the user's email
    const resetLink = `https://your-frontend-url.com/reset-password?token=${token}`;
    await this.authservice.sendPasswordResetEmail(user.email, resetLink);
    return {
      message: 'password reset link has been sento to ur email',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() ResetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = ResetPasswordDto;
    if (newPassword != confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.findOneByResetToken(token);
    console.log(user);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }
    const currentTime = new Date();

    if (user.resetPasswordExpires < currentTime) {
      throw new BadRequestException('Reset token has expired');
    }
    // Step 5: Hash the new password
    const hashedPassword = await this.authservice.hashPassword(newPassword);
    await this.userService.updateUser(user._id.toString(), {
      password: hashedPassword,

      resetPasswordToken: null, // Clear the token
      resetPasswordExpires: null, // Clear the expiration time
    });

    return { message: 'Password has been successfully reset' };
  }
}

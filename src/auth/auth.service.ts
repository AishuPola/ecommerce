import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { User, UserRole } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { OtpService } from 'src/otp/otp.service';

let temporaryUsers = new Map();
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    // let user = await this.userService.findByEmail(identifier);

    // if (!user) {
    //   user = await this.userService.findByUsername(identifier);
    // }
    const user = await this.userService.findByEmailOrUsername(
      identifier,
      identifier,
    );
    console.log('✅', user);
    // If user is found, verify the password
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // remove password before returning user
      console.log('result', result);
      return result; // the user is present inside the .doc inside the result
    }

    return null; // user or password is invalid
  }

  // async signup(SignUpDto: SignUpDto): Promise<User> {
  //   const {
  //     firstname,
  //     lastname,
  //     username,
  //     email,
  //     phoneNumber,
  //     country,
  //     password,
  //     confirmPassword,

  //     role,
  //   } = SignUpDto;
  //   if (password != confirmPassword) {
  //     throw new BadRequestException(
  //       'password and Confirm password must match each other',
  //     );
  //   }
  //   const existingUser = await this.userService.findByEmailOrUsername(
  //     email,
  //     username,
  //   );
  //   if (existingUser) {
  //     throw new ConflictException(
  //       'user with this email or username already exists',
  //     );
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const otp = crypto.randomInt(100000, 999999).toString();
  //   const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
  //   try {
  //     const newUser = await this.userService.create({
  //       firstname,
  //       lastname,
  //       username,
  //       email,
  //       phoneNumber,
  //       country,
  //       password: hashedPassword,
  //       otp,
  //       otpExpiration,
  //       isVerified: false,
  //       role,
  //     });

  //     console.log(newUser);

  //     await this.sendOtpToEmail(email, otp);
  //     console.log('OTP sent to email:', email);
  //     //await this.otpService.sendOtpToPhone(phoneNumber, otp);
  //     console.log('otp sent to phone:', phoneNumber);
  //     return newUser;
  //   } catch (error) {
  //     console.log('Error creating user', error);
  //     throw new InternalServerErrorException('failed to create user');
  //   }
  // }

  // creating the user only after verification is done
  async signup(SignUpDto: SignUpDto): Promise<{ message: string }> {
    const {
      firstname,
      lastname,
      username,
      email,
      phoneNumber,
      country = '',
      password,
      confirmPassword,
      role = UserRole.USER,
    } = SignUpDto;
    if (password != confirmPassword) {
      throw new BadRequestException('password and confirm password must match');
    }
    const existingUser = await this.userService.findByEmailOrUsername(
      email,
      username,
    );
    if (existingUser) {
      throw new ConflictException(
        'user with this email or username already existss',
      );
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    //store temporary user data in memory or another temporary storage

    // const tempUser = {
    //   firstname,
    //   lastname,
    //   username,
    //   email,
    //   phoneNumber,
    //   country,
    //   otp,
    //   otpExpiration,
    //   isVerified: false,
    //   role,
    //   password,
    // };
    // Store temporary user in memory or in a session/cache
    // await this.userService.storeTemporaryUser(email, tempUser);
    temporaryUsers.set(email, {
      firstname,
      lastname,
      username,
      email,
      phoneNumber,
      country,
      otp,
      password,
      otpExpiration,
      isVerified: false,
      role,
    });
    await this.sendOtpToEmail(email, otp);
    // await this.otpService.sendOtpToPhone(phoneNumber, otp);

    return { message: 'OTP sent to email and phone. Please verify' };
  }

  async sendOtpToEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.user_mail,
        pass: process.env.user_pass,
      },
    });
    const mailOptions = {
      from: process.env.user_mail,
      to: email,
      subject: 'Your OTP for Signup Verification',
      text: `Your OTP is ${otp}. This OTP is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to email: ${email}`);
    console.log('otp is', otp);
  }

  // async sendOtpToPhone(phoneNumber: string, otp: string) {
  //   const twilioClient = new Twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
  //   await twilioClient.messages.create({
  //     body: `Your OTP for signup verification is ${otp}. This OTP is valid for 10 minutes.`,
  //     from: '+919000906504', // Replace with your Twilio phone number
  //     to: phoneNumber,
  //   });

  //   console.log(`OTP sent to phone number: ${phoneNumber}`);
  // }

  // async verifyOtp(email: string, otp: string): Promise<boolean> {
  //   const user = await this.userService.findByemail(email);
  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }
  //   console.log('User OTP:', user.otp);
  //   console.log('Entered OTP:', otp);
  //   console.log('User OTP Expiration:', user.otpExpiration);
  //   console.log('Current Time:', new Date());
  //   const otpExpirationDate = new Date(user.otpExpiration).toISOString();
  //   const currentTime = new Date().toISOString();

  //   if (user.otp != otp) {
  //     throw new UnauthorizedException('Invalid OTP');
  //   }

  //   if (otpExpirationDate <= currentTime) {
  //     throw new UnauthorizedException('OTP has expired');
  //   }

  //   user.isVerified = true;
  //   await this.userService.update(user._id.toString(), { isVerified: true });
  //   return true;
  // }

  // another way to verify otp to store data only after verification is done

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{
    message: string;
  }> {
    // const tempUser = await this.userService.getTemporaryUserByEmail(email);
    let tempUser = temporaryUsers.get(email);
    console.log('email', email);
    console.log('temp user found', tempUser);
    if (!tempUser) {
      throw new UnauthorizedException('temporary user not found');
    }
    if (tempUser.otp != otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    if (new Date() > tempUser.otpExpiration) {
      throw new UnauthorizedException('otp has expired');
    }
    if (!tempUser.password) {
      throw new BadRequestException('Password is missing');
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    const newUser = await this.userService.create({
      firstname: tempUser.firstname,
      lastname: tempUser.lastname,
      username: tempUser.username,
      email: tempUser.email,
      phoneNumber: tempUser.phoneNumber,
      country: tempUser.country,
      password: hashedPassword,
      role: tempUser.role,
      isVerified: true,
      otp: tempUser.otp,
      otpExpiration: tempUser.otpExpiration,
    });
    temporaryUsers.delete(email); //remove the temporary user after creating the permanent user
    console.log('new user details are:', newUser);
    console.log('otp is', otp);
    return { message: 'user successfully verified and created' };
  }
  async login(
    LoginDto: LoginDto,
  ): Promise<{ access_token: string; sub: string }> {
    const { identifier, password } = LoginDto;
    const user = await this.validateUser(identifier, password);

    if (!user) {
      throw new UnauthorizedException('invalid login credentials');
    }
    console.log(user._doc.username, user._doc._id);
    const payload = {
      username: user._doc.username,
      sub: user._doc._id,
      role: user._doc.role,
    };

    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
      sub: user._doc._id.toString(),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  //send password Reset Email
  async sendPasswordResetEmail(email: string, link: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.user_mail,
        pass: process.env.user_pass,
      },
    });
    const subject = 'Password Reset Request';
    const body = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${link}" target="_blank">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
     
    `;
    const mailOptions: nodemailer.sendMailOptions = {
      from: ' "Support Team" <paishwarya2003@gmail.com>',
      to: email,
      subject: subject,
      html: body,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error(`error sending password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }
}

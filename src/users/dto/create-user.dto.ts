import {
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: number;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  otpExpiration: Date;

  isVerified: boolean;

  role: UserRole;
}

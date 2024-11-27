import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqual } from 'src/users/custom-validator/is-equal.validator';
import { UserRole } from 'src/users/schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN') // Adjust the country code based on your requirements
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  // @IsNotEmpty()
  // otp: number;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  @IsEqual('password', { message: 'Confirm password must match password' }) // Custom validation to check if password and confirmPassword match
  confirmPassword: string;

  role: UserRole;
}

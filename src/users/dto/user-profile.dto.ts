import { IsEmail, IsString } from 'class-validator';

export class UserProfileDto {
  id: string;
  fullName: string;
  username: string;
  @IsEmail()
  email: string;
  phoneNumber: string;
  @IsString()
  country: string;
  @IsString()
  address?: string;
  @IsString()
  profilePicture?: string;

  isVerified: boolean;
  role: string;
}

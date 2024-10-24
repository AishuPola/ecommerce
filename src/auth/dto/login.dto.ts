import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // This field will accept either the username or email
  @IsString()
  @IsNotEmpty()
  password: string;
}

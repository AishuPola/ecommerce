import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/users/schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;
  role: UserRole;
}

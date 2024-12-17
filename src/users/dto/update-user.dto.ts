import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  resetPasswordToken?: string | null;

  @IsOptional()
  resetPasswordExpires?: Date | null;
}

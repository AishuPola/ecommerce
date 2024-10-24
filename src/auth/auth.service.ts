import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(SignUpDto: SignUpDto): Promise<User> {
    const { username, email, password, role } = SignUpDto;
    const existingUser = await this.userService.findByEmailOrUsername(
      email,
      username,
    );
    if (existingUser) {
      throw new ConflictException('user already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.userService.create({
        username,
        email,
        password: hashedPassword,
      });
      console.log(newUser);
      return newUser;
    } catch {}
  }
}

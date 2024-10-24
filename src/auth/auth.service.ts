import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    // Try to find by email first
    let user = await this.userService.findByEmail(identifier);

    // If no user found by email, search by username
    if (!user) {
      user = await this.userService.findByUsername(identifier);
    }

    // If user is found, verify the password
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // remove password before returning user
      return result;
    }

    return null; // return null if user is not found or password is invalid
  }

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
  async login(LoginDto: LoginDto): Promise<{ access_token: string }> {
    const { identifier, password } = LoginDto;
    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException('invalid login credentials');
    }
    const payload = {
      username: user.username,
      sub: user._id,
    };
    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

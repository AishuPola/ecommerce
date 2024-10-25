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
    console.log(user._doc.username, user._doc._id);
    const payload = {
      username: user._doc.username,
      sub: user._doc._id,
    };
    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

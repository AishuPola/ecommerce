import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use env variable for secret key
    });
  }

  async validate(payload: any) {
    const { username } = payload;

    // Find the user using findByEmailOrUsername
    const user = await this.usersService.findByEmailOrUsername(
      username,
      username,
    );

    if (!user) {
      throw new UnauthorizedException('User not found or unauthorized');
    }
    return { ...user, role: user.role }; // Return the user if found
  }
}

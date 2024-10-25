import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt-secret', // Use ConfigService for env variables
    });
  }

  async validate(payload: any) {
    const { username } = payload; // Extract username from payload

    // Use findByEmailOrUsername to find the user by username
    const user = await this.usersService.findByEmailOrUsername(
      username,
      username,
    );

    if (!user) {
      throw new UnauthorizedException('User not found or unauthorized');
    }
    return user; // Return the user if found
  }
}

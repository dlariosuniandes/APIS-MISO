import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Token } from '../auth.service';
import jwtConstants from 'src/shared/security/constants';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.JWT_SECRET,
    });
  }

  async validate(payload: Token) {
    if (payload.role !== 'ADMIN') {
      throw new UnauthorizedException("You don't have enough permissions");
    }
    return { id: payload.sub, username: payload.username };
  }
}

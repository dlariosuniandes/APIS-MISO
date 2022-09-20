import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'src/shared/auth/jwtconstants';
import { Token } from '../auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Token) {
    if (payload.role !== 'ADMIN') {
      throw new UnauthorizedException("You don't have enough permissions");
    }
    return { id: payload.sub, username: payload.username };
  }
}

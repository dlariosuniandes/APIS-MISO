import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import jwtConstants from 'src/shared/security/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      roles: this.getRoles(payload),
      resources: this.getResources(payload),
    };
  }

  getRoles(payload: any) {
    const roles = [];
    for (let index = 0; index < payload.roles?.length; index++) {
      roles.push(payload.roles[index].name);
    }
    return roles;
  }

  getResources(payload: any) {
    const resources = [];
    for (let index = 0; index < payload.resources?.length; index++) {
      resources.push(payload.resources[index]);
    }
    return resources;
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../role.decorator';
import { Token } from 'src/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );
    if (!jwt) {
      return false;
    }
    const decoded: Token = this.jwtService.decode(jwt) as Token;
    switch (decoded.role) {
      case 'admin':
        return true;
      default:
        if (requiredRoles.some((role) => decoded.role === role)) {
          return true;
        } else return false;
    }
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/shared/enums/role.enum';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));

    /*
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
          if (decoded.resources) {
            const url: string = context.switchToHttp().getRequest().url;

            let allResources = resourcesList.join('|');
            allResources =
              '\\W*(?:\\b(?!(?:' + allResources + ')\\b)\\w+\\W*|\\W+)+';
            const Rx = new RegExp(allResources, 'g');
            const urlResources = [
              ...new Set(url.replace(Rx, '|').split('|')),
            ].filter((s) => s);
            return urlResources.every((r) => decoded.resources.includes(r));
          } else return true;
        } else return false;
    }
    */
  }
}

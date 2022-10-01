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
    const { url } = context.switchToHttp().getRequest();
    return this.isAuthorized(user, requiredRoles, url);
  }

  isAuthorized(user: any, requiredRoles: Role[], urlResource: string) {
    const userHasRole = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );
    if (!userHasRole) return false;

    const resources = user.resources;
    if (!resources.length) return true;

    const requiredResources = urlResource.replace('/api/v1/', '').split('/');
    requiredResources.sort();
    resources.sort();
    for (let index = 0; index < requiredResources.length; ++index) {
      if (requiredResources[index] !== resources[index]) return false;
    }
    return true;
  }
}

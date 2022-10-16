import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/shared/enums/role.enum';
import { resourcesList } from 'src/shared/security/constants';
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

    const requiredResources = [];
    const urlResources = urlResource.replace('/api/v1/', '').split('/');
    resourcesList.forEach((resource) => {
      if (urlResources.includes(resource)) {
        requiredResources.push(resource);
      }
    });
    return requiredResources.every((r) => resources.includes(r));
  }
}

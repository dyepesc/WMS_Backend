// src/customers/guards/tenant-access.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RequestUser {
  userId: number;
  email: string;
  roles: string[];
  tenant_id: number;
}

@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;
    
    // Make sure we have a user
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Get the tenant ID from the request params
    const params = request.params;
    const requestedTenantId = parseInt(params.tenantId, 10);

    // Make sure we have both tenant IDs to compare
    if (!requestedTenantId || !user.tenant_id) {
      throw new ForbiddenException('Invalid tenant information');
    }

    // Check if the user's tenant matches the requested tenant
    if (user.tenant_id !== requestedTenantId) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    // If we have roles to check, verify the user has the required role
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    // Make sure user has roles array
    if (!user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('User roles not properly configured');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have the required role to access this resource');
    }

    return true;
  }
}

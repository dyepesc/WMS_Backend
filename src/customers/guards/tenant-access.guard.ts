// src/customers/guards/tenant-access.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedTenantId = parseInt(request.params.tenantId, 10);

    // Check if user belongs to the requested tenant
    if (user.tenant_id !== requestedTenantId) {
      throw new ForbiddenException(
        'You can only manage customers in your own tenant',
      );
    }

    // Check if user has the necessary role
    const allowedRoles = [
      'tenant_super_admin',
      'tenant_admin',
      'account_manager_supervisor',
    ];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to manage customers',
      );
    }

    return true;
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedTenantId = parseInt(request.params.tenantId, 10);

    // Check if user belongs to the requested tenant
    if (user.tenantId !== requestedTenantId) {
      throw new ForbiddenException('You can only manage users in your own tenant');
    }

    // Check if user has admin privileges
    if (!['tenant_super_admin', 'tenant_admin'].includes(user.role)) {
      throw new ForbiddenException('Only tenant administrators can manage users');
    }

    return true;
  }
}
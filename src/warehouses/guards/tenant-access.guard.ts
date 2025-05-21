import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class WarehouseTenantAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedTenantId = parseInt(request.params.tenantId, 10);

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Check if user belongs to the requested tenant
    if (user.tenant_id !== requestedTenantId) {
      throw new ForbiddenException('You can only access resources in your own tenant');
    }

    // Check if user has appropriate role for warehouse management
    if (!['tenant_super_admin', 'tenant_admin'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to manage warehouses');
    }

    return true;
  }
}
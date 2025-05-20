import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CarrierTenantAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedTenantId = parseInt(request.params.tenantId, 10);

    console.log('Guard - Request user:', user); // Debug log
    console.log('Guard - Requested tenant ID:', requestedTenantId); // Debug log

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Check if user belongs to the requested tenant
    if (user.tenant_id !== requestedTenantId) {
      throw new ForbiddenException('You can only access resources in your own tenant');
    }

    // Check if user has appropriate role for carrier management
    if (!['tenant_super_admin', 'tenant_admin', 'logistics_manager'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to manage carriers');
    }

    return true;
  }
}

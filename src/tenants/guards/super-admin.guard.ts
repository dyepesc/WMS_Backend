import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user is authenticated
    if (!request.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Check if user is a super admin
    if (request.user.role !== 'super_admin') {
      throw new ForbiddenException('Only super administrators can access this resource');
    }

    return true;
  }
} 
import { IsString, IsEmail, IsBoolean, IsOptional, IsIn, IsInt, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsIn(['tenant_super_admin', 'tenant_admin', 'warehouse_manager', 'staff_user', 'client_portal_user'])
  role: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  override_permissions?: Record<string, any>;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['tenant_super_admin', 'tenant_admin', 'warehouse_manager', 'staff_user', 'client_portal_user'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  override_permissions?: Record<string, any>;
}

export class ListUsersDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @IsIn(['username', 'email', 'fullName', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}

export class LoginDto {
  @IsString()
  usernameOrEmail: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  tenantIdentifier?: string;
}
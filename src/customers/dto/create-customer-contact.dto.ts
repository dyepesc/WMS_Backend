import { IsString, IsOptional, IsEmail, IsBoolean, IsObject, IsNumber } from 'class-validator';

export class CreateCustomerContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;

  @IsOptional()
  @IsObject()
  notificationPreferences?: Record<string, string[]>;

  @IsOptional()
  @IsBoolean()
  hasPortalAccess?: boolean = false;

  @IsOptional()
  @IsNumber()
  portalUserId?: number;

  @IsOptional()
  @IsString()
  portalAccessLevel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsString()
  notes?: string;
}
// src/customers/dto/create-customer-contact.dto.ts
import {
    IsString,
    IsEmail,
    IsOptional,
    IsBoolean,
    IsObject,
    IsNumber,
    IsNotEmpty,
  } from 'class-validator';
  
  export class CreateCustomerContactDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsString()
    @IsOptional()
    position?: string;
  
    @IsString()
    @IsOptional()
    department?: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsOptional()
    phone?: string;
  
    @IsString()
    @IsOptional()
    mobile?: string;
  
    @IsBoolean()
    @IsOptional()
    isPrimary?: boolean = false;
  
    @IsObject()
    @IsOptional()
    notificationPreferences?: Record<string, string[]>;
  
    @IsBoolean()
    @IsOptional()
    hasPortalAccess?: boolean = false;
  
    @IsNumber()
    @IsOptional()
    portalUserId?: number;
  
    @IsString()
    @IsOptional()
    portalAccessLevel?: string;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
  
    @IsString()
    @IsOptional()
    notes?: string;
  }
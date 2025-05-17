// src/customers/dto/create-customer.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsNumber,
  IsBoolean,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['company', 'individual'])
  entityType?: string;

  @IsOptional()
  @IsString()
  address1?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  stateProvince?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsNumber()
  accountManagerId?: number;

  @IsOptional()
  @IsObject()
  receivingHours?: Record<string, { open: string; close: string }>;

  @IsOptional()
  @IsObject()
  shippingHours?: Record<string, { open: string; close: string }>;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsBoolean()
  allowsBackorders?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresAppointmentForReceiving?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresAppointmentForShipping?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['FEFO', 'FIFO', 'LIFO'])
  inventoryMethod?: string;

  @IsOptional()
  @IsString()
  integrationCode?: string;

  @IsOptional()
  @IsBoolean()
  portalAccess?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}

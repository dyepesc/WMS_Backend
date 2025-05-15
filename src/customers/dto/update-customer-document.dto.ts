// src/customers/dto/update-customer-document.dto.ts
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class UpdateCustomerDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['Contract', 'SLA', 'Invoice', 'Other'])
  documentType?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: string;
}
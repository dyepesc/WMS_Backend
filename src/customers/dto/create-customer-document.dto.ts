// src/customers/dto/create-customer-document.dto.ts
import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsUrl } from 'class-validator';

export class CreateCustomerDocumentDto {
  @IsString()
  title: string;

  @IsString()
  @IsEnum(['Contract', 'SLA', 'Invoice', 'Other'])
  documentType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsDateString()
  issuedDate?: string;
}

export class CreateExternalDocumentDto extends CreateCustomerDocumentDto {
  @IsString()
  fileName: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  fileType: string;

  @IsString()
  fileUrl: string;

  @IsUrl()
  externalUrl: string;
}
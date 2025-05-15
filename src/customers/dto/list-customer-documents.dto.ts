// src/customers/dto/list-customer-documents.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListCustomerDocumentsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: string;
}
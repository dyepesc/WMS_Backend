// src/customers/dto/list-customer-contacts.dto.ts
import { IsOptional, IsBoolean, IsNumber, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCustomerContactsDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasPortalAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @IsIn(['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'])
  sortBy?: string = 'firstName';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'asc';
}
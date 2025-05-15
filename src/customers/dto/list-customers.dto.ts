// src/customers/dto/list-customers.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListCustomersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'archived'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  portalAccess?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountManagerId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'code', 'createdAt'])
  sortBy?: string = 'name';

  // @IsOptional()
  // @IsString()
  // @IsIn(['asc', 'desc'])
  // sortOrder?: string = 'asc';
}

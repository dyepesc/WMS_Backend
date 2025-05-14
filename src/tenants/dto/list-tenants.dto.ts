import { IsOptional, IsString, IsEnum, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ListTenantsDto {
  @IsOptional()
  @IsString()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  name?: string;

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
  @IsIn(['name', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
} 
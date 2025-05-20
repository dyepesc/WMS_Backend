import { IsOptional, IsString, IsBoolean, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export type SortOrder = 'ASC' | 'DESC';

export class ListCarriersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  @IsIn(['name', 'code', 'createdAt', 'updatedAt'])
  sortBy?: string = 'name';

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: SortOrder = 'ASC';
}
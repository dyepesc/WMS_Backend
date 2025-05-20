import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Transform } from 'class-transformer';

export enum WarehouseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed'
}

export enum MeasurementStandard {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export class ListWarehousesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(WarehouseStatus)
  @Transform(({ value }) => value?.toLowerCase())
  status?: WarehouseStatus;

  @IsOptional()
  @IsEnum(MeasurementStandard)
  @Transform(({ value }) => value?.toLowerCase())
  measurementStandard?: MeasurementStandard;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

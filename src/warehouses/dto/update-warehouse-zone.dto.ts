import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ZoneType } from './create-warehouse-zone.dto';

export class UpdateWarehouseZoneDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ZoneType)
  @IsOptional()
  type?: ZoneType;

  @IsString()
  @IsOptional()
  status?: string;
}

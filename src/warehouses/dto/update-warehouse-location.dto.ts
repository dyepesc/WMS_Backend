import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { LocationType } from './create-warehouse-location.dto';

export class UpdateWarehouseLocationDto {
  @IsString()
  @IsOptional()
  locationBarcode?: string;

  @IsNumber()
  @IsOptional()
  zoneId?: number;

  @IsString()
  @IsOptional()
  aisle?: string;

  @IsString()
  @IsOptional()
  bay?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(LocationType)
  @IsOptional()
  locationType?: LocationType;

  @IsNumber()
  @IsOptional()
  capacityWeightKg?: number;

  @IsNumber()
  @IsOptional()
  capacityVolumeCbm?: number;

  @IsNumber()
  @IsOptional()
  dimensionLengthCm?: number;

  @IsNumber()
  @IsOptional()
  dimensionWidthCm?: number;

  @IsNumber()
  @IsOptional()
  dimensionHeightCm?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  allowMixedItems?: boolean;

  @IsBoolean()
  @IsOptional()
  allowMixedLots?: boolean;

  @IsBoolean()
  @IsOptional()
  allowMixedCustomers?: boolean;

  @IsNumber()
  @IsOptional()
  pickSequence?: number;

  @IsNumber()
  @IsOptional()
  putawaySequence?: number;

  @IsString()
  @IsOptional()
  customField1?: string;
}

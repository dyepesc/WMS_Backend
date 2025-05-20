import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export enum LocationType {
  BIN = 'Bin',
  SHELF = 'Shelf',
  PALLET_SPOT = 'PalletSpot',
  STAGING = 'Staging'
}

export class CreateWarehouseLocationDto {
  @IsString()
  locationBarcode: string;

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
  locationType: LocationType;

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

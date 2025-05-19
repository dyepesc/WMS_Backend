import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseUomDto {
  @IsString()
  uom: string;

  @IsString()
  @IsOptional()
  barcode?: string;
}

export class CreateItemDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  itemType?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOnHand?: number;

  @IsNumber()
  @IsOptional()
  maxOnHand?: number;

  @IsNumber()
  @IsOptional()
  reorderPoint?: number;

  @IsString()
  @IsOptional()
  serialNumberTracking?: string;

  @IsBoolean()
  @IsOptional()
  expirationDateTracking?: boolean;

  @IsString()
  @IsOptional()
  lotNumberTracking?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isHazmat?: boolean;

  @IsString()
  @IsOptional()
  hazmatClass?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  customsCommodityCode?: string;

  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  dimensionUnit?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  weightUnit?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => BaseUomDto)
  baseUom: BaseUomDto;
}
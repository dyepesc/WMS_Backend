import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
// import { BaseUomDto } from './base-uom.dto';
import { ItemType } from '../entities/items.entity';

export class BaseUomDto {
  @IsString()
  uom: string;

  @IsNumber()
  @IsOptional()
  conversionFactor?: number;

  @IsBoolean()
  @IsOptional()
  isBaseUnit?: boolean;

  @IsString()
  @IsOptional()
  barcode?: string;

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

  @IsEnum(ItemType)
  itemType: ItemType;

  @IsString()
  @IsEnum(['active', 'inactive', 'discontinued'])
  status: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isHazmat?: boolean;

  @IsNumber()
  @IsOptional()
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

  @IsObject()
  @ValidateNested()
  @Type(() => BaseUomDto)
  baseUom: BaseUomDto;
}

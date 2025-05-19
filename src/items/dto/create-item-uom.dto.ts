// src/items/dto/create-item-uom.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsIn } from 'class-validator';

export class CreateItemUomDto {
  @IsString()
  uom: string;

  @IsNumber()
  @Min(0.0001)
  conversionFactor: number;

  @IsBoolean()
  @IsOptional()
  isBaseUnit?: boolean;

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
  @IsIn(['cm', 'in', 'm', 'ft'])
  dimensionUnit?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  @IsIn(['kg', 'lb', 'g', 'oz'])
  weightUnit?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
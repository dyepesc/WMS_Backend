import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum ZoneType {
  RECEIVING = 'receiving',
  STORAGE = 'storage',
  SHIPPING = 'shipping',
  CROSS_DOCK = 'cross-dock',
  QUARANTINE = 'quarantine'
}

export enum ZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

export class CreateWarehouseZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ZoneType)
  @IsNotEmpty()
  type: ZoneType;

  @IsEnum(ZoneStatus)
  @IsNotEmpty()
  status: ZoneStatus;
}

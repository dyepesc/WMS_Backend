import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MeasurementStandard {
  METRIC = 'Metric',
  IMPERIAL = 'Imperial'
}

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  city: string;

  @IsString()
  stateProvince: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  timeZone: string;

  @IsEnum(MeasurementStandard)
  @IsOptional()
  measurementStandard?: MeasurementStandard;

  @IsString()
  @IsOptional()
  status?: string;
}

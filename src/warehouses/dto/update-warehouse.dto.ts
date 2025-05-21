import { IsString, IsOptional, IsEnum } from 'class-validator'; 
import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDto } from './create-warehouses.dto';
import { MeasurementStandard } from '../../common/enums/measurement-standard.enum';


export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  stateProvince?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  timeZone?: string;

  @IsEnum(MeasurementStandard)
  @IsOptional()
  measurementStandard?: MeasurementStandard;

  @IsString()
  @IsOptional()
  status?: string;
}

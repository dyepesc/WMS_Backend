import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MeasurementStandard } from '../../common/enums/measurement-standard.enum';

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
 
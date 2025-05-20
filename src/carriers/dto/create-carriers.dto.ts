import { IsString, IsOptional, IsBoolean, IsArray, IsEmail } from 'class-validator';

export class CreateCarrierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceTypes?: string[];

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  trackingUrlTemplate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

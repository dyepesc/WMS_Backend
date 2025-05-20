import { IsString, IsOptional, IsBoolean, IsArray, IsEmail } from 'class-validator';

export class CreateCarrierDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceTypes?: string[];

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  trackingUrlTemplate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
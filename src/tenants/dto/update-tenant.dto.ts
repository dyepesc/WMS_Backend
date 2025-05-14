import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  subscriptionPlanId?: string;
} 
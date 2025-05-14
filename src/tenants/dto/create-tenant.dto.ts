import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['active', 'inactive'])
  status: string;

  @IsNotEmpty()
  @IsString()
  subscriptionPlanId: string;
} 
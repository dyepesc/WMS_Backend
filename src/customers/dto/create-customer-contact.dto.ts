import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsObject,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerContactDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Position/title of the contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Department of the contact', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Office phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Mobile phone number', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    description: 'Whether this is the primary contact',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({
    description: 'Notification preferences configuration',
    required: false,
    example: { order_shipped: ['email'], stock_alerts: ['sms'] },
  })
  @IsOptional()
  @IsObject()
  notificationPreferences?: Record<string, string[]>;

  @ApiProperty({
    description: 'Whether contact has portal access',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasPortalAccess?: boolean;

  @ApiProperty({
    description: 'Portal user ID if exists',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  portalUserId?: number;

  @ApiProperty({
    description: 'Portal access level',
    required: false,
  })
  @IsOptional()
  @IsString()
  portalAccessLevel?: string;

  @ApiProperty({ description: 'Whether the contact is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Additional notes about the contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

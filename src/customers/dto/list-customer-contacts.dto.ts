import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto';

export class ListCustomerContactsDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filter by primary contact status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({
    description: 'Filter by portal access status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasPortalAccess?: boolean;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

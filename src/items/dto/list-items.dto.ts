import { IsOptional, IsString, IsBoolean, IsEnum, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListItemsDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  itemType?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isHazmat?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(['sku', 'name', 'category', 'createdAt'])
  sortBy?: string = 'sku';
}

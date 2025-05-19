// src/items/dto/update-item-uom.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateItemUomDto } from './create-item-uom.dto';

export class UpdateItemUomDto extends PartialType(CreateItemUomDto) {}
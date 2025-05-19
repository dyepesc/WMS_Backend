// src/items/services/item-uoms.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemUom } from '../entities/item-uom.entity';
import { Item } from '../entities/items.entity';
import { CreateItemUomDto } from '../dto/create-item-uom.dto';
import { UpdateItemUomDto } from '../dto/update-item-uom.dto';

@Injectable()
export class ItemUomsService {
  constructor(
    @InjectRepository(ItemUom)
    private itemUomRepository: Repository<ItemUom>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(
    tenantId: number,
    customerId: number,
    itemId: number,
    createItemUomDto: CreateItemUomDto,
  ): Promise<ItemUom> {
    // Verify item exists and belongs to customer and tenant
    const item = await this.itemRepository.findOne({
      where: { id: itemId, tenant_id: tenantId, customerId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Check if UOM already exists for this item
    const existingUom = await this.itemUomRepository.findOne({
      where: { itemId, uom: createItemUomDto.uom },
    });

    if (existingUom) {
      throw new BadRequestException('UOM already exists for this item');
    }

    // If this is being set as base unit, ensure no other base unit exists
    if (createItemUomDto.isBaseUnit) {
      const existingBaseUnit = await this.itemUomRepository.findOne({
        where: { itemId, isBaseUnit: true },
      });

      if (existingBaseUnit) {
        throw new BadRequestException('Item already has a base unit');
      }
    }

    // Create the UOM conversion
    const itemUom = this.itemUomRepository.create({
      ...createItemUomDto,
      tenant_id: tenantId,
      itemId,
    });

    return this.itemUomRepository.save(itemUom);
  }

  async findAll(
    tenantId: number,
    customerId: number,
    itemId: number,
    query: any,
  ) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'uom',
      sortOrder = 'asc',
      uom,
    } = query;

    const queryBuilder = this.itemUomRepository
      .createQueryBuilder('uom')
      .where('uom.tenant_id = :tenantId', { tenantId })
      .andWhere('uom.itemId = :itemId', { itemId });

    if (uom) {
      queryBuilder.andWhere('uom.uom = :uom', { uom });
    }

    // Apply sorting
    queryBuilder.orderBy(
      `uom.${sortBy}`,
      sortOrder.toUpperCase() as 'ASC' | 'DESC',
    );

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [uoms, total] = await queryBuilder.getManyAndCount();

    return {
      data: uoms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    tenantId: number,
    customerId: number,
    itemId: number,
    uomId: number,
  ): Promise<ItemUom> {
    const itemUom = await this.itemUomRepository.findOne({
      where: { id: uomId, tenant_id: tenantId, itemId },
    });

    if (!itemUom) {
      throw new NotFoundException('UOM conversion not found');
    }

    return itemUom;
  }

  async update(
    tenantId: number,
    customerId: number,
    itemId: number,
    uomId: number,
    updateItemUomDto: UpdateItemUomDto,
  ): Promise<ItemUom> {
    const itemUom = await this.findOne(tenantId, customerId, itemId, uomId);

    // If updating to base unit, ensure no other base unit exists
    if (updateItemUomDto.isBaseUnit && !itemUom.isBaseUnit) {
      const existingBaseUnit = await this.itemUomRepository.findOne({
        where: { itemId, isBaseUnit: true },
      });

      if (existingBaseUnit && existingBaseUnit.id !== uomId) {
        throw new BadRequestException('Item already has a base unit');
      }
    }

    Object.assign(itemUom, updateItemUomDto);
    return this.itemUomRepository.save(itemUom);
  }

  async remove(
    tenantId: number,
    customerId: number,
    itemId: number,
    uomId: number,
  ): Promise<void> {
    const itemUom = await this.findOne(tenantId, customerId, itemId, uomId);

    // Prevent deletion of base unit
    if (itemUom.isBaseUnit) {
      throw new BadRequestException('Cannot delete the base unit');
    }

    await this.itemUomRepository.remove(itemUom);
  }
}

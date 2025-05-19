import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/items.entity';
import { ItemUnitConversion } from '../entities/item-unit-conversion.entity';
import { CreateItemDto } from '../dto/create-items.dto';
import { UpdateItemDto } from '../dto/update-items.dto';
import { ListItemsDto } from '../dto/list-items.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    @InjectRepository(ItemUnitConversion)
    private unitConversionRepository: Repository<ItemUnitConversion>,
  ) {}

  async create(
    tenantId: number,
    customerId: number,
    createItemDto: CreateItemDto,
    userId: number,
  ): Promise<Item> {
    // Check if SKU already exists for this tenant and customer
    const existingItem = await this.itemsRepository.findOne({
      where: { tenant_id: tenantId, customerId, sku: createItemDto.sku },
    });

    if (existingItem) {
      throw new BadRequestException('SKU already exists for this customer');
    }

    // Create the item
    const item = this.itemsRepository.create({
      ...createItemDto,
      tenant_id: tenantId,
      customerId,
      createdByUserId: userId,
    });

    const savedItem = await this.itemsRepository.save(item);

    // Create base UOM conversion with tenant_id
    const baseUom = this.unitConversionRepository.create({
      itemId: savedItem.id,
      tenant_id: tenantId,
      uom: createItemDto.baseUom.uom,
      conversionFactor: 1,
      isBaseUnit: true,
      barcode: createItemDto.baseUom.barcode,
    });

    await this.unitConversionRepository.save(baseUom);

    return this.findOne(tenantId, customerId, savedItem.id);
  }

  async findAll(tenantId: number, customerId: number, query: ListItemsDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'sku',
      sortOrder = 'asc',
      ...filters
    } = query;

    const queryBuilder = this.itemsRepository
      .createQueryBuilder('item')
      .where('item.tenant_id = :tenantId', { tenantId })
      .andWhere('item.customerId = :customerId', { customerId });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryBuilder.andWhere(`item.${key} = :${key}`, { [key]: value });
      }
    });

    // Apply sorting with explicit type casting
    queryBuilder.orderBy(`item.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
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
    id: number,
  ): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id, tenant_id: tenantId, customerId },
      relations: ['unitConversions'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async update(
    tenantId: number,
    customerId: number,
    id: number,
    updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const item = await this.findOne(tenantId, customerId, id);

    // If SKU is being updated, check for uniqueness
    if (updateItemDto.sku && updateItemDto.sku !== item.sku) {
      const existingItem = await this.itemsRepository.findOne({
        where: { tenant_id: tenantId, customerId, sku: updateItemDto.sku },
      });

      if (existingItem) {
        throw new BadRequestException('SKU already exists for this customer');
      }
    }

    Object.assign(item, updateItemDto);
    return this.itemsRepository.save(item);
  }

  async remove(
    tenantId: number,
    customerId: number,
    id: number,
  ): Promise<void> {
    const item = await this.findOne(tenantId, customerId, id);

    // Soft delete by setting isActive to false
    item.isActive = false;
    item.status = 'inactive';

    await this.itemsRepository.save(item);
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/items.entity';
import { ItemUom } from '../entities/item-uom.entity';
import { CreateItemDto } from '../dto/create-items.dto';
import { UpdateItemDto } from '../dto/update-items.dto';
import { ListItemsDto } from '../dto/list-items.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(ItemUom)
    private itemUomRepository: Repository<ItemUom>,
  ) {}

  async create(tenantId: number, customerId: number, createdByUserId: number, createItemDto: CreateItemDto): Promise<Item> {
    // Create the item
    const item = this.itemRepository.create({
      ...createItemDto,
      tenant_id: tenantId,
      customerId: customerId,
      createdByUserId: createdByUserId,
    });

    const savedItem = await this.itemRepository.save(item);

    // Create base UOM if provided
    if (createItemDto.baseUom) {
      const baseUom = this.itemUomRepository.create({
        tenant_id: tenantId,
        itemId: savedItem.id,
        ...createItemDto.baseUom,
      });

      await this.itemUomRepository.save(baseUom);
    }

    // Return the created item with its relationships
    return this.findOne(tenantId, customerId, savedItem.id);
  }

  async findAll(tenantId: number, customerId: number, query: ListItemsDto) {
    const { page = 1, limit = 20, sortBy = 'sku', sortOrder = 'asc', ...filters } = query;

    const queryBuilder = this.itemRepository
      .createQueryBuilder('item')
      .where('item.tenant_id = :tenantId', { tenantId })
      .andWhere('item.customerId = :customerId', { customerId });

    // Apply filters
    if (filters.sku) {
      queryBuilder.andWhere('item.sku ILIKE :sku', { sku: `%${filters.sku}%` });
    }
    if (filters.name) {
      queryBuilder.andWhere('item.name ILIKE :name', { name: `%${filters.name}%` });
    }
    if (filters.category) {
      queryBuilder.andWhere('item.category = :category', { category: filters.category });
    }
    if (filters.itemType) {
      queryBuilder.andWhere('item.itemType = :itemType', { itemType: filters.itemType });
    }
    if (filters.status) {
      queryBuilder.andWhere('item.status = :status', { status: filters.status });
    }
    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('item.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters.isHazmat !== undefined) {
      queryBuilder.andWhere('item.isHazmat = :isHazmat', { isHazmat: filters.isHazmat });
    }

    // Apply sorting
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

  async findOne(tenantId: number, customerId: number, id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id, tenant_id: tenantId, customerId },
      relations: ['unitConversions'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async update(tenantId: number, customerId: number, id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(tenantId, customerId, id);

    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async remove(tenantId: number, customerId: number, id: number): Promise<void> {
    const item = await this.findOne(tenantId, customerId, id);
    await this.itemRepository.remove(item);
  }
}

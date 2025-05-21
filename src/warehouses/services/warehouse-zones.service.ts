import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseZone } from '../entities/warehouse-zone.entity';
import { Warehouse } from '../entities/warehouses.entity';
import { CreateWarehouseZoneDto } from '../dto/create-warehouse-zone.dto';
import { UpdateWarehouseZoneDto } from '../dto/update-warehouse-zone.dto';

@Injectable()
export class WarehouseZonesService {
  constructor(
    @InjectRepository(WarehouseZone)
    private readonly zoneRepository: Repository<WarehouseZone>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(
    tenantId: number,
    warehouseId: number,
    userId: number,
    createWarehouseZoneDto: CreateWarehouseZoneDto,
  ): Promise<WarehouseZone> {
    // Verify warehouse exists and belongs to tenant
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId, tenant_id: tenantId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found or does not belong to tenant');
    }

    const zone = new WarehouseZone();
    Object.assign(zone, {
      ...createWarehouseZoneDto,
      tenant_id: tenantId,
      warehouse_id: warehouseId,
      created_by: userId,
    });

    return this.zoneRepository.save(zone);
  }

  async findAll(tenantId: number, warehouseId: number, query: any) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      ...filters
    } = query;

    const queryBuilder = this.zoneRepository
      .createQueryBuilder('zone')
      .where('zone.tenant_id = :tenantId', { tenantId })
      .andWhere('zone.warehouse_id = :warehouseId', { warehouseId });

    // Apply filters
    if (filters.code) {
      queryBuilder.andWhere('zone.code = :code', { code: filters.code });
    }
    if (filters.name) {
      queryBuilder.andWhere('zone.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.type) {
      queryBuilder.andWhere('zone.type = :type', { type: filters.type });
    }
    if (filters.status) {
      queryBuilder.andWhere('zone.status = :status', {
        status: filters.status,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`zone.${sortBy}`, sortOrder.toUpperCase());

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: number, warehouseId: number, id: number): Promise<WarehouseZone> {
    // First verify the warehouse belongs to the tenant
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId, tenant_id: tenantId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found or does not belong to tenant');
    }

    // Then find the zone
    const zone = await this.zoneRepository.findOne({
      where: { id, warehouse_id: warehouseId },
    });

    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    return zone;
  }

  async update(
    tenantId: number,
    warehouseId: number,
    id: number,
    updateWarehouseZoneDto: UpdateWarehouseZoneDto,
  ): Promise<WarehouseZone> {
    const zone = await this.findOne(tenantId, warehouseId, id);

    // Check if code is being updated and if it's already in use
    if (updateWarehouseZoneDto.code && updateWarehouseZoneDto.code !== zone.code) {
      const existingZone = await this.zoneRepository.findOne({
        where: { warehouse_id: warehouseId, code: updateWarehouseZoneDto.code },
      });

      if (existingZone) {
        throw new Error(`Zone with code ${updateWarehouseZoneDto.code} already exists in this warehouse`);
      }
    }

    Object.assign(zone, updateWarehouseZoneDto);
    return this.zoneRepository.save(zone);
  }

  async remove(tenantId: number, warehouseId: number, id: number): Promise<void> {
    const zone = await this.findOne(tenantId, warehouseId, id);

    // Soft delete by updating status
    zone.status = 'inactive';
    await this.zoneRepository.save(zone);
  }
}

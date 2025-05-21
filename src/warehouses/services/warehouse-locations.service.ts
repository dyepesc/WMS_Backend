import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseLocation } from '../entities/warehouse-location.entity';
import { Warehouse } from '../entities/warehouses.entity';
import { WarehouseZone } from '../entities/warehouse-zone.entity';
import { CreateWarehouseLocationDto } from '../dto/create-warehouse-location.dto';
import { UpdateWarehouseLocationDto } from '../dto/update-warehouse-location.dto';

@Injectable()
export class WarehouseLocationsService {
  constructor(
    @InjectRepository(WarehouseLocation)
    private readonly locationRepository: Repository<WarehouseLocation>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseZone)
    private readonly warehouseZoneRepository: Repository<WarehouseZone>,
  ) {}

  async create(
    tenantId: number,
    warehouseId: number,
    userId: number,
    createWarehouseLocationDto: CreateWarehouseLocationDto,
  ): Promise<WarehouseLocation> {
    // Verify warehouse exists and belongs to tenant
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId, tenant_id: tenantId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Verify zone exists and belongs to the warehouse
    const zone = await this.warehouseZoneRepository.findOne({
      where: {
        id: createWarehouseLocationDto.zoneId,
        warehouse_id: warehouseId,
      },
    });

    if (!zone) {
      throw new NotFoundException(
        `Zone with ID ${createWarehouseLocationDto.zoneId} not found in this warehouse`,
      );
    }

    // Check if location barcode already exists in this warehouse
    const existingLocation = await this.locationRepository.findOne({
      where: {
        warehouse_id: warehouseId,
        locationBarcode: createWarehouseLocationDto.locationBarcode,
      },
    });

    if (existingLocation) {
      throw new Error(
        `Location with barcode ${createWarehouseLocationDto.locationBarcode} already exists in this warehouse`,
      );
    }

    const location = new WarehouseLocation();
    Object.assign(location, {
      ...createWarehouseLocationDto,
      tenant_id: tenantId,
      warehouse_id: warehouseId,
      zone_id: createWarehouseLocationDto.zoneId,
      created_by: userId,
    });

    return this.locationRepository.save(location);
  }

  async findAll(tenantId: number, warehouseId: number, query: any) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'locationBarcode',
      sortOrder = 'asc',
      ...filters
    } = query;

    const queryBuilder = this.locationRepository
      .createQueryBuilder('location')
      .where('location.tenant_id = :tenantId', { tenantId })
      .andWhere('location.warehouse_id = :warehouseId', { warehouseId });

    // Apply filters
    if (filters.locationBarcode) {
      queryBuilder.andWhere(
        'location.location_barcode ILIKE :locationBarcode',
        { locationBarcode: `%${filters.locationBarcode}%` },
      );
    }
    if (filters.zoneId) {
      queryBuilder.andWhere('location.zone_id = :zoneId', {
        zoneId: filters.zoneId,
      });
    }
    if (filters.locationType) {
      queryBuilder.andWhere('location.location_type = :locationType', {
        locationType: filters.locationType,
      });
    }
    if (filters.status) {
      queryBuilder.andWhere('location.status = :status', {
        status: filters.status,
      });
    }
    // Add more filters as needed

    // Apply sorting
    queryBuilder.orderBy(`location.${sortBy}`, sortOrder.toUpperCase());

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

  async findOne(tenantId: number, warehouseId: number, id: number): Promise<WarehouseLocation> {
    // First verify the warehouse belongs to the tenant
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId, tenant_id: tenantId }
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found or does not belong to tenant');
    }

    // Then find the location
    const location = await this.locationRepository.findOne({
      where: { id, warehouse_id: warehouseId }
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(
    tenantId: number,
    warehouseId: number,
    id: number,
    updateWarehouseLocationDto: UpdateWarehouseLocationDto,
  ): Promise<WarehouseLocation> {
    const location = await this.findOne(tenantId, warehouseId, id);

    // If zone is being updated, verify it exists and belongs to the warehouse
    if (updateWarehouseLocationDto.zoneId) {
      const zone = await this.warehouseZoneRepository.findOne({
        where: {
          id: updateWarehouseLocationDto.zoneId,
          warehouse_id: warehouseId,
        },
      });

      if (!zone) {
        throw new NotFoundException(
          `Zone with ID ${updateWarehouseLocationDto.zoneId} not found in this warehouse`,
        );
      }
    }

    // If barcode is being updated, check for duplicates
    if (
      updateWarehouseLocationDto.locationBarcode &&
      updateWarehouseLocationDto.locationBarcode !== location.locationBarcode
    ) {
      const existingLocation = await this.locationRepository.findOne({
        where: {
          warehouse_id: warehouseId,
          locationBarcode: updateWarehouseLocationDto.locationBarcode,
        },
      });

      if (existingLocation) {
        throw new Error(
          `Location with barcode ${updateWarehouseLocationDto.locationBarcode} already exists in this warehouse`,
        );
      }
    }

    Object.assign(location, updateWarehouseLocationDto);
    return this.locationRepository.save(location);
  }

  async remove(
    tenantId: number,
    warehouseId: number,
    id: number,
  ): Promise<void> {
    const location = await this.findOne(tenantId, warehouseId, id);

    // Soft delete by updating status
    location.status = 'inactive';
    await this.locationRepository.save(location);
  }
}

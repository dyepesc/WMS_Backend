import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouses.entity';
import { CreateWarehouseDto } from '../dto/create-warehouses.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { ListWarehousesDto } from '../dto/list-warehouses.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(tenantId: number, createWarehouseDto: CreateWarehouseDto, userId: number): Promise<Warehouse> {
    // Check for duplicate code
    const existingCode = await this.warehouseRepository.findOne({
      where: { tenant_id: tenantId, code: createWarehouseDto.code }
    });
    if (existingCode) {
      throw new BadRequestException('Warehouse code already exists in this tenant');
    }

    const warehouse = this.warehouseRepository.create({
      ...createWarehouseDto,
      tenant_id: tenantId,
      createdByUserId: userId,
    });

    return this.warehouseRepository.save(warehouse);
  }

  async findAll(
    tenantId: number,
    listWarehousesDto: ListWarehousesDto,
  ): Promise<[Warehouse[], number]> {
    const {
      page = 1,
      limit = 10,
      search,
      code,
      city,
      state,
      country,
      status,
      measurementStandard,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = listWarehousesDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .where('warehouse.tenant_id = :tenantId', { tenantId });

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(warehouse.name ILIKE :search OR warehouse.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply other filters
    if (code) {
      queryBuilder.andWhere('warehouse.code = :code', { code });
    }
    if (city) {
      queryBuilder.andWhere('warehouse.city = :city', { city });
    }
    if (state) {
      queryBuilder.andWhere('warehouse.state = :state', { state });
    }
    if (country) {
      queryBuilder.andWhere('warehouse.country = :country', { country });
    }
    if (status) {
      queryBuilder.andWhere('warehouse.status = :status', { status });
    }
    if (measurementStandard) {
      queryBuilder.andWhere(
        'warehouse.measurement_standard = :measurementStandard',
        { measurementStandard },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`warehouse.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findOne(tenantId: number, id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(
    tenantId: number,
    id: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouse = await this.findOne(tenantId, id);

    // If code is being updated, check uniqueness
    if (updateWarehouseDto.code && updateWarehouseDto.code !== warehouse.code) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { tenant_id: tenantId, code: updateWarehouseDto.code },
      });

      if (existingWarehouse) {
        throw new BadRequestException(
          'Warehouse code must be unique within the tenant',
        );
      }
    }

    Object.assign(warehouse, updateWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async remove(tenantId: number, id: number): Promise<void> {
    const warehouse = await this.findOne(tenantId, id);

    // Soft delete by updating status
    warehouse.status = 'inactive';
    await this.warehouseRepository.save(warehouse);
  }
}

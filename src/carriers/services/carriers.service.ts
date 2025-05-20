import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from '../entities/carriers.entity';
import { CreateCarrierDto } from '../dto/create-carriers.dto';
import { UpdateCarrierDto } from '../dto/update-carriers.dto';
import { ListCarriersDto } from '../dto/list-carriers.dto';

@Injectable()
export class CarriersService {
  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepository: Repository<Carrier>,
  ) {}

  async create(
    tenantId: number,
    userId: number,
    createCarrierDto: CreateCarrierDto,
  ): Promise<Carrier> {
    // Check for duplicate name
    const existingCarrier = await this.carrierRepository.findOne({
      where: { tenant_id: tenantId, name: createCarrierDto.name },
    });

    if (existingCarrier) {
      throw new BadRequestException('Carrier with this name already exists');
    }

    // Check for duplicate code if provided
    if (createCarrierDto.code) {
      const existingCode = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, code: createCarrierDto.code },
      });

      if (existingCode) {
        throw new BadRequestException('Carrier with this code already exists');
      }
    }

    const carrier = this.carrierRepository.create({
      ...createCarrierDto,
      tenant_id: tenantId,
      created_by: userId,
    });

    return this.carrierRepository.save(carrier);
  }

  async findAll(tenantId: number, query: ListCarriersDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'ASC',
      ...filters
    } = query;

    const queryBuilder = this.carrierRepository
      .createQueryBuilder('carrier')
      .where('carrier.tenant_id = :tenantId', { tenantId });

    // Apply filters
    if (filters.name) {
      queryBuilder.andWhere('carrier.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.code) {
      queryBuilder.andWhere('carrier.code = :code', { code: filters.code });
    }
    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('carrier.is_active = :isActive', {
        isActive: filters.isActive,
      });
    }
    if (filters.serviceType) {
      queryBuilder.andWhere('carrier.service_types @> :serviceType', {
        serviceType: JSON.stringify([filters.serviceType]),
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`carrier.${sortBy}`, sortOrder);

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

  async findOne(tenantId: number, id: number): Promise<Carrier> {
    const carrier = await this.carrierRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    return carrier;
  }

  async update(
    tenantId: number,
    id: number,
    updateCarrierDto: UpdateCarrierDto,
  ): Promise<Carrier> {
    const carrier = await this.findOne(tenantId, id);

    // Check for duplicate name if being updated
    if (updateCarrierDto.name && updateCarrierDto.name !== carrier.name) {
      const existingCarrier = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, name: updateCarrierDto.name },
      });

      if (existingCarrier) {
        throw new BadRequestException('Carrier with this name already exists');
      }
    }

    // Check for duplicate code if being updated
    if (updateCarrierDto.code && updateCarrierDto.code !== carrier.code) {
      const existingCode = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, code: updateCarrierDto.code },
      });

      if (existingCode) {
        throw new BadRequestException('Carrier with this code already exists');
      }
    }

    Object.assign(carrier, updateCarrierDto);
    return this.carrierRepository.save(carrier);
  }

  async remove(tenantId: number, id: number): Promise<void> {
    const carrier = await this.findOne(tenantId, id);
    carrier.isActive = false;
    await this.carrierRepository.save(carrier);
  }
}

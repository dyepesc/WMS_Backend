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
    private carrierRepository: Repository<Carrier>,
  ) {}

  async create(
    tenantId: number,
    createCarrierDto: CreateCarrierDto,
    userId: number,
  ): Promise<Carrier> {
    // console.log('Creating carrier with userId:', userId); // Debug log

    // Check for duplicate name
    const existingName = await this.carrierRepository.findOne({
      where: { tenant_id: tenantId, name: createCarrierDto.name },
    });
    if (existingName) {
      throw new BadRequestException(
        'Carrier name already exists in this tenant',
      );
    }

    // Check for duplicate code if provided
    if (createCarrierDto.code) {
      const existingCode = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, code: createCarrierDto.code },
      });
      if (existingCode) {
        throw new BadRequestException(
          'Carrier code already exists in this tenant',
        );
      }
    }

    const carrier = this.carrierRepository.create({
      ...createCarrierDto,
      tenant_id: tenantId,
      created_by: userId,
    });

    // console.log('Created carrier entity:', carrier); // Debug log
    return this.carrierRepository.save(carrier);
  }

  async findAll(tenantId: number, queryParams: ListCarriersDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      ...filters
    } = queryParams;
    const skip = (page - 1) * limit;

    const queryBuilder = this.carrierRepository
      .createQueryBuilder('carrier')
      .where('carrier.tenant_id = :tenantId', { tenantId });

    if (filters.name) {
      queryBuilder.andWhere('carrier.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.code) {
      queryBuilder.andWhere('carrier.code = :code', { code: filters.code });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('carrier.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.serviceType) {
      queryBuilder.andWhere('carrier.serviceTypes @> :serviceType', {
        serviceType: JSON.stringify([filters.serviceType]),
      });
    }

    queryBuilder
      .orderBy(`carrier.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [carriers, total] = await queryBuilder.getManyAndCount();

    return {
      data: carriers,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(tenantId: number, id: number): Promise<Carrier> {
    const carrier = await this.carrierRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!carrier) {
      throw new NotFoundException(
        `Carrier with ID ${id} not found in tenant ${tenantId}`,
      );
    }

    return carrier;
  }

  async update(
    tenantId: number,
    id: number,
    updateCarrierDto: UpdateCarrierDto,
  ): Promise<Carrier> {
    const carrier = await this.findOne(tenantId, id);

    if (updateCarrierDto.name && updateCarrierDto.name !== carrier.name) {
      const existingName = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, name: updateCarrierDto.name },
      });
      if (existingName) {
        throw new BadRequestException(
          'Carrier name already exists in this tenant',
        );
      }
    }

    if (updateCarrierDto.code && updateCarrierDto.code !== carrier.code) {
      const existingCode = await this.carrierRepository.findOne({
        where: { tenant_id: tenantId, code: updateCarrierDto.code },
      });
      if (existingCode) {
        throw new BadRequestException(
          'Carrier code already exists in this tenant',
        );
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

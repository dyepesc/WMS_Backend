import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { ListTenantsDto } from './dto/list-tenants.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(queryParams: ListTenantsDto) {
    const { status, name, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;
    
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

    if (status) {
      queryBuilder.andWhere('tenant.status = :status', { status });
    }

    if (name) {
      queryBuilder.andWhere('tenant.name ILIKE :name', { name: `%${name}%` });
    }

    queryBuilder.orderBy(`tenant.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [tenants, total] = await queryBuilder.getManyAndCount();

    return {
      data: tenants,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  async update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    const updatedTenant = Object.assign(tenant, updateTenantDto);
    return await this.tenantRepository.save(updatedTenant);
  }

  async remove(id: number): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }
} 
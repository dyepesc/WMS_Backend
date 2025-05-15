// src/customers/customers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ListCustomersDto } from './dto/list-customers.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(tenantId: number, createCustomerDto: CreateCustomerDto, currentUser: User) {
    // Check for duplicate code
    const existingCustomer = await this.customerRepository.findOne({
      where: { tenant_id: tenantId, code: createCustomerDto.code }
    });

    if (existingCustomer) {
      throw new BadRequestException(`Customer with code ${createCustomerDto.code} already exists`);
    }

    // Validate account manager if provided
    if (createCustomerDto.accountManagerId) {
      const accountManager = await this.userRepository.findOne({
        where: { id: createCustomerDto.accountManagerId, tenant_id: tenantId }
      });

      if (!accountManager) {
        throw new NotFoundException(`Account manager with ID ${createCustomerDto.accountManagerId} not found`);
      }
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      tenant_id: tenantId,
      createdByUserId: currentUser.id
    });

    return this.customerRepository.save(customer);
  }

  async findAll(tenantId: number, queryParams: ListCustomersDto) {
    const { 
      code, 
      name, 
      status, 
      portalAccess, 
      accountManagerId,
      page = 1, 
      limit = 20, 
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = queryParams;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer')
      .where('customer.tenant_id = :tenantId', { tenantId });

    if (code) {
      queryBuilder.andWhere('customer.code ILIKE :code', { code: `%${code}%` });
    }

    if (name) {
      queryBuilder.andWhere('customer.name ILIKE :name', { name: `%${name}%` });
    }

    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    if (portalAccess !== undefined) {
      queryBuilder.andWhere('customer.portalAccess = :portalAccess', { portalAccess });
    }

    if (accountManagerId) {
      queryBuilder.andWhere('customer.accountManagerId = :accountManagerId', { accountManagerId });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .orderBy(`customer.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [customers, total] = await queryBuilder.getManyAndCount();

    return {
      data: customers,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }
}
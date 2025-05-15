import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ListCustomersDto } from '../dto/list-customers.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(tenantId: number, createCustomerDto: CreateCustomerDto, userId: number): Promise<Customer> {
    // Check if code already exists for tenant
    const existingCustomer = await this.customerRepository.findOne({
      where: { tenantId, code: createCustomerDto.code }
    });

    if (existingCustomer) {
      throw new ConflictException(`Customer with code ${createCustomerDto.code} already exists`);
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      tenantId,
      createdByUserId: userId,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(
    tenantId: number,
    queryParams: ListCustomersDto,
  ): Promise<PaginatedResponse<Customer>> {
    const {
      search,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryParams;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
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
        limit,
      },
    };
  }

  async findOne(tenantId: number, customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenantId }
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return customer;
  }

  async update(
    tenantId: number,
    customerId: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(tenantId, customerId);

    if (updateCustomerDto.code) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { tenantId, code: updateCustomerDto.code }
      });

      if (existingCustomer && existingCustomer.id !== customerId) {
        throw new ConflictException(
          `Customer with code ${updateCustomerDto.code} already exists`,
        );
      }
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(tenantId: number, customerId: number): Promise<void> {
    const customer = await this.findOne(tenantId, customerId);
    await this.customerRepository.softDelete(customer.id);
  }
}
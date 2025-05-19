// src/suppliers/services/suppliers.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { ListSuppliersDto } from '../dto/list-suppliers.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(tenantId: number, customerId: number, dto: CreateSupplierDto) {
    // Verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenant_id: tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    // Check for duplicate code if provided
    if (dto.code) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: {
          tenantId,
          customerId,
          code: dto.code,
        },
      });

      if (existingSupplier) {
        throw new BadRequestException(
          `Supplier with code ${dto.code} already exists for this customer`,
        );
      }
    }

    const supplier = this.supplierRepository.create({
      ...dto,
      tenantId,
      customerId,
    });

    return this.supplierRepository.save(supplier);
  }

  async findAll(tenantId: number, customerId: number, query: ListSuppliersDto) {
    // Verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenant_id: tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    const {
      name,
      code,
      isActive,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const queryBuilder = this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.tenantId = :tenantId', { tenantId })
      .andWhere('supplier.customerId = :customerId', { customerId });

    if (name) {
      queryBuilder.andWhere('supplier.name ILIKE :name', { name: `%${name}%` });
    }

    if (code) {
      queryBuilder.andWhere('supplier.code = :code', { code });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('supplier.isActive = :isActive', { isActive });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .orderBy(`supplier.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [suppliers, total] = await queryBuilder.getManyAndCount();

    return {
      data: suppliers,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(tenantId: number, customerId: number, supplierId: number) {
    const supplier = await this.supplierRepository.findOne({
      where: {
        id: supplierId,
        tenantId,
        customerId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(
    tenantId: number,
    customerId: number,
    supplierId: number,
    dto: CreateSupplierDto,
  ) {
    const supplier = await this.findOne(tenantId, customerId, supplierId);

    // Check for duplicate code if code is being updated
    if (dto.code && dto.code !== supplier.code) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: {
          tenantId,
          customerId,
          code: dto.code,
        },
      });

      if (existingSupplier) {
        throw new BadRequestException(
          `Supplier with code ${dto.code} already exists for this customer`,
        );
      }
    }

    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async remove(tenantId: number, customerId: number, supplierId: number) {
    const supplier = await this.findOne(tenantId, customerId, supplierId);

    // Implement soft delete
    supplier.isActive = false;
    return this.supplierRepository.save(supplier);
  }
}

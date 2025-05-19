// src/customers/services/customer-contacts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerContact } from '../entities/customer-contact.entity';
import { Customer } from '../entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCustomerContactDto, ListCustomerContactsDto } from '../dto';

@Injectable()
export class CustomerContactsService {
  constructor(
    @InjectRepository(CustomerContact)
    private contactRepository: Repository<CustomerContact>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    tenantId: number,
    customerId: number,
    dto: CreateCustomerContactDto,
  ) {
    // First, verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenant_id: tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    // Check for duplicate email
    if (dto.email) {
      const existingContact = await this.contactRepository.findOne({
        where: { customerId, email: dto.email },
      });

      if (existingContact) {
        throw new BadRequestException('Email already exists for this customer');
      }
    }

    // If this is set as primary contact, unset any existing primary contact
    if (dto.isPrimary) {
      await this.contactRepository.update(
        { customerId, isPrimary: true },
        { isPrimary: false },
      );
    }

    // Handle portal access if requested
    if (dto.hasPortalAccess) {
      // Additional portal user creation/validation logic would go here
      // This might involve creating a user account with client_portal_user role
    }

    const contact = this.contactRepository.create({
      ...dto,
      tenantId,
      customerId,
    });

    return this.contactRepository.save(contact);
  }

  async findAll(
    tenantId: number,
    customerId: number,
    query: ListCustomerContactsDto,
  ) {
    // Verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenant_id: tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    const {
      isPrimary,
      hasPortalAccess,
      isActive,
      page = 1,
      limit = 20,
      sortBy = 'firstName',
      sortOrder = 'asc',
    } = query;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.customerId = :customerId', { customerId });

    if (isPrimary !== undefined) {
      queryBuilder.andWhere('contact.isPrimary = :isPrimary', { isPrimary });
    }

    if (hasPortalAccess !== undefined) {
      queryBuilder.andWhere('contact.hasPortalAccess = :hasPortalAccess', {
        hasPortalAccess,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('contact.isActive = :isActive', { isActive });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .orderBy(`contact.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [contacts, total] = await queryBuilder.getManyAndCount();

    return {
      data: contacts,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(tenantId: number, customerId: number, contactId: number) {
    // Verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenant_id: tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    const contact = await this.contactRepository.findOne({
      where: { id: contactId, customerId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(
    tenantId: number,
    customerId: number,
    contactId: number,
    dto: CreateCustomerContactDto,
  ) {
    const contact = await this.findOne(tenantId, customerId, contactId);

    // Check for duplicate email if email is being updated
    if (dto.email && dto.email !== contact.email) {
      const existingContact = await this.contactRepository.findOne({
        where: { customerId, email: dto.email },
      });

      if (existingContact) {
        throw new BadRequestException('Email already exists for this customer');
      }
    }

    // Handle primary contact changes
    if (dto.isPrimary && !contact.isPrimary) {
      await this.contactRepository.update(
        { customerId, isPrimary: true },
        { isPrimary: false },
      );
    }

    // Handle portal access changes
    if (
      dto.hasPortalAccess !== undefined &&
      dto.hasPortalAccess !== contact.hasPortalAccess
    ) {
      // Additional portal user update logic would go here
    }

    Object.assign(contact, dto);
    return this.contactRepository.save(contact);
  }

  async remove(tenantId: number, customerId: number, contactId: number) {
    const contact = await this.findOne(tenantId, customerId, contactId);

    if (contact.hasPortalAccess) {
      // Additional logic to handle portal user deactivation would go here
    }

    return this.contactRepository.remove(contact);
  }
}

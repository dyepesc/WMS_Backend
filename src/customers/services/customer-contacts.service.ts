import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerContact, Customer } from '../entities';
import {
  CreateCustomerContactDto,
  UpdateCustomerContactDto,
  ListCustomerContactsDto,
} from '../dto';

@Injectable()
export class CustomerContactsService {
  constructor(
    @InjectRepository(CustomerContact)
    private contactRepository: Repository<CustomerContact>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(
    tenantId: number,
    customerId: number,
    dto: CreateCustomerContactDto,
  ) {
    // First, verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId })
      .andWhere('customer.tenant_id = :tenantId', { tenantId })
      .getOne();

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    // Check for duplicate email
    if (dto.email) {
      const existingContact = await this.contactRepository
        .createQueryBuilder('contact')
        .where('contact.customer_id = :customerId', { customerId })
        .andWhere('contact.email = :email', { email: dto.email })
        .getOne();

      if (existingContact) {
        throw new BadRequestException('Email already exists for this customer');
      }
    }

    // If this is set as primary contact, unset any existing primary contact
    if (dto.isPrimary === true) {
      await this.contactRepository
        .createQueryBuilder()
        .update(CustomerContact)
        .set({ isPrimary: false })
        .where('customer_id = :customerId', { customerId })
        .andWhere('is_primary = true')
        .execute();
    }

    // Create the new contact
    const contact = this.contactRepository.create({
      ...dto,
      customerId, // Use the entity property name, not the database column name
    });

    return this.contactRepository.save(contact);
  }

  async findAll(
    tenantId: number,
    customerId: number,
    query: ListCustomerContactsDto,
  ) {
    // First, verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId })
      .andWhere('customer.tenant_id = :tenantId', { tenantId })
      .getOne();

    if (!customer) {
      throw new NotFoundException('Customer not found in this tenant');
    }

    const {
      page = 1,
      limit = 20,
      sortBy = 'first_name',
      sortOrder = 'asc',
      isPrimary,
      hasPortalAccess,
      isActive,
    } = query as ListCustomerContactsDto;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .select([
        'contact.id',
        'contact.customer_id as customerId',
        'contact.first_name as firstName',
        'contact.last_name as lastName',
        'contact.position',
        'contact.department',
        'contact.email',
        'contact.phone',
        'contact.mobile',
        'contact.is_primary as isPrimary',
        'contact.notification_preferences as notificationPreferences',
        'contact.has_portal_access as hasPortalAccess',
        'contact.portal_user_id as portalUserId',
        'contact.portal_access_level as portalAccessLevel',
        'contact.is_active as isActive',
        'contact.notes',
        'contact.created_at as createdAt',
        'contact.updated_at as updatedAt',
      ])
      .where('contact.customer_id = :customerId', { customerId });

    // Apply filters using snake_case column names
    if (isPrimary !== undefined) {
      queryBuilder.andWhere('contact.is_primary = :isPrimary', {
        isPrimary,
      });
    }
    if (hasPortalAccess !== undefined) {
      queryBuilder.andWhere('contact.has_portal_access = :hasPortalAccess', {
        hasPortalAccess,
      });
    }
    if (isActive !== undefined) {
      queryBuilder.andWhere('contact.is_active = :isActive', {
        isActive,
      });
    }

    // Add sorting using snake_case column names
    const snakeCaseMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      isPrimary: 'is_primary',
      hasPortalAccess: 'has_portal_access',
      isActive: 'is_active',
      portalUserId: 'portal_user_id',
      portalAccessLevel: 'portal_access_level',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    const dbColumnName = snakeCaseMap[sortBy as keyof typeof snakeCaseMap] || sortBy;
    queryBuilder.orderBy(
      `contact.${dbColumnName}`,
      (sortOrder || 'asc').toUpperCase() as 'ASC' | 'DESC',
    );

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

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
    // First, verify the customer exists and belongs to the tenant
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId })
      .andWhere('customer.tenant_id = :tenantId', { tenantId })
      .getOne();

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
    dto: UpdateCustomerContactDto,
  ) {
    const contact = await this.findOne(tenantId, customerId, contactId);

    // Check for duplicate email if email is being updated
    const email = dto.email as string;
    if (email && email !== contact.email) {
      const existingContact = await this.contactRepository.findOne({
        where: { customerId, email },
      });

      if (existingContact) {
        throw new BadRequestException('Email already exists for this customer');
      }
    }

    // If setting as primary contact, unset any existing primary contact
    const isPrimary = dto.isPrimary as boolean;
    if (isPrimary && !contact.isPrimary) {
      await this.contactRepository.update(
        { customerId, isPrimary: true },
        { isPrimary: false },
      );
    }

    Object.assign(contact, dto);
    return this.contactRepository.save(contact);
  }

  async remove(tenantId: number, customerId: number, contactId: number) {
    const contact = await this.findOne(tenantId, customerId, contactId);
    return this.contactRepository.remove(contact);
  }
}

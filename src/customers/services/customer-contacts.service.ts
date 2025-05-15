import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerContact } from '../entities/customer-contact.entity';
import { Customer } from '../entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCustomerContactDto } from '../dto/create-customer-contact.dto';
import { UpdateCustomerContactDto } from '../dto/update-customer-contact.dto';
import { ListCustomerContactsDto } from '../dto/list-customer-contacts.dto';

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

  private async validateCustomer(tenantId: number, customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenantId }
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${customerId} not found or does not belong to tenant ${tenantId}`,
      );
    }

    return customer;
  }

  async create(tenantId: number, customerId: number, createDto: CreateCustomerContactDto) {
    // Validate customer exists and belongs to tenant
    const customer = await this.validateCustomer(tenantId, customerId);

    // Check for duplicate email within the customer
    const existingContact = await this.contactRepository.findOne({
      where: { customer_id: customerId, email: createDto.email }
    });

    if (existingContact) {
      throw new BadRequestException(`Contact with email ${createDto.email} already exists for this customer`);
    }

    // If portal access is requested, validate or create user
    if (createDto.hasPortalAccess) {
      if (createDto.portalUserId) {
        const portalUser = await this.userRepository.findOne({
          where: { id: createDto.portalUserId, tenant_id: tenantId }
        });
        if (!portalUser) {
          throw new NotFoundException(`Portal user with ID ${createDto.portalUserId} not found`);
        }
      }
      // Note: Creation of portal user should be handled separately if needed
    }

    const contact = this.contactRepository.create({
      ...createDto,
      tenant_id: tenantId,
      customer_id: customerId,
    });

    return this.contactRepository.save(contact);
  }

  async findAll(tenantId: number, customerId: number, queryParams: ListCustomerContactsDto) {
    const {
      isPrimary,
      hasPortalAccess,
      isActive,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    const queryBuilder = this.contactRepository.createQueryBuilder('contact')
      .where('contact.tenant_id = :tenantId', { tenantId })
      .andWhere('contact.customer_id = :customerId', { customerId });

    if (isPrimary !== undefined) {
      queryBuilder.andWhere('contact.isPrimary = :isPrimary', { isPrimary });
    }

    if (hasPortalAccess !== undefined) {
      queryBuilder.andWhere('contact.hasPortalAccess = :hasPortalAccess', { hasPortalAccess });
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
        limit
      }
    };
  }

  async findOne(tenantId: number, customerId: number, contactId: number) {
    const contact = await this.contactRepository.findOne({
      where: {
        id: contactId,
        tenant_id: tenantId,
        customer_id: customerId
      }
    });

    if (!contact) {
      throw new NotFoundException(`Contact not found or does not belong to the specified customer/tenant`);
    }

    return contact;
  }

  async update(tenantId: number, customerId: number, contactId: number, updateDto: UpdateCustomerContactDto) {
    const contact = await this.findOne(tenantId, customerId, contactId);

    // Check email uniqueness if being updated
    if (updateDto.email && updateDto.email !== contact.email) {
      const existingContact = await this.contactRepository.findOne({
        where: { customer_id: customerId, email: updateDto.email }
      });

      if (existingContact) {
        throw new BadRequestException(`Contact with email ${updateDto.email} already exists for this customer`);
      }
    }

    // Validate portal user if being updated
    if (updateDto.portalUserId) {
      const portalUser = await this.userRepository.findOne({
        where: { id: updateDto.portalUserId, tenant_id: tenantId }
      });
      if (!portalUser) {
        throw new NotFoundException(`Portal user with ID ${updateDto.portalUserId} not found`);
      }
    }

    Object.assign(contact, updateDto);
    return this.contactRepository.save(contact);
  }

  async remove(tenantId: number, customerId: number, contactId: number) {
    const contact = await this.findOne(tenantId, customerId, contactId);
    
    // If contact has portal access, handle portal user cleanup if needed
    if (contact.hasPortalAccess && contact.portalUserId) {
      // Note: Handle portal user cleanup as needed
    }

    // Implement soft delete
    contact.isActive = false;
    return this.contactRepository.save(contact);
  }
}
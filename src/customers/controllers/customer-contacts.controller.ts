import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { TenantAccessGuard } from '../guards/tenant-access.guard';
  import { CustomerContactsService } from '../services/customer-contacts.service';
  import { CreateCustomerContactDto } from '../dto/create-customer-contact.dto';
  import { UpdateCustomerContactDto } from '../dto/update-customer-contact.dto';
  import { ListCustomerContactsDto } from '../dto/list-customer-contacts.dto';
  
  @Controller('api/v1/tenants/:tenantId/customers/:customerId/contacts')
  @UseGuards(JwtAuthGuard, TenantAccessGuard)
  export class CustomerContactsController {
    constructor(private readonly contactsService: CustomerContactsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Body() createDto: CreateCustomerContactDto,
    ) {
      return this.contactsService.create(tenantId, customerId, createDto);
    }
  
    @Get()
    async findAll(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Query() queryParams: ListCustomerContactsDto,
    ) {
      return this.contactsService.findAll(tenantId, customerId, queryParams);
    }
  
    @Get(':contactId')
    async findOne(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
    ) {
      return this.contactsService.findOne(tenantId, customerId, contactId);
    }
  
    @Put(':contactId')
    async update(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
      @Body() updateDto: UpdateCustomerContactDto,
    ) {
      return this.contactsService.update(tenantId, customerId, contactId, updateDto);
    }
  
    @Delete(':contactId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
    ) {
      await this.contactsService.remove(tenantId, customerId, contactId);
    }
  }
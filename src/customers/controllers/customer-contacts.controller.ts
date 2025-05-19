// src/customers/controllers/customer-contacts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../guards/tenant-access.guard';
import { CustomerContactsService } from '../services/customer-contacts.service';
import { CreateCustomerContactDto, ListCustomerContactsDto } from '../dto';

@Controller('api/v1/tenants/:tenantId/customers/:customerId/contacts')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class CustomerContactsController {
  constructor(
    private readonly customerContactsService: CustomerContactsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() createContactDto: CreateCustomerContactDto,
  ) {
    return this.customerContactsService.create(
      tenantId,
      customerId,
      createContactDto,
    );
  }

  @Get()
  async findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query() queryParams: ListCustomerContactsDto,
  ) {
    return this.customerContactsService.findAll(
      tenantId,
      customerId,
      queryParams,
    );
  }

  @Get(':contactId')
  async findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.customerContactsService.findOne(
      tenantId,
      customerId,
      contactId,
    );
  }

  @Put(':contactId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() updateContactDto: CreateCustomerContactDto,
  ) {
    return this.customerContactsService.update(
      tenantId,
      customerId,
      contactId,
      updateContactDto,
    );
  }

  @Delete(':contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    await this.customerContactsService.remove(tenantId, customerId, contactId);
  }
}

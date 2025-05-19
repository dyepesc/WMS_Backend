// src/customers/controllers/customers.controller.ts
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
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../guards/tenant-access.guard';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto, ListCustomersDto, UpdateCustomerDto } from '../dto';

@Controller('api/v1/tenants/:tenantId/customers')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req,
  ) {
    return this.customersService.create(tenantId, createCustomerDto, req.user);
  }

  @Get()
  async findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() queryParams: ListCustomersDto,
  ) {
    return this.customersService.findAll(tenantId, queryParams);
  }

  @Get(':customerId')
  async findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return this.customersService.findOne(tenantId, customerId);
  }

  @Put(':customerId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenantId, customerId, updateCustomerDto);
  }

  @Delete(':customerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    await this.customersService.remove(tenantId, customerId);
  }
}

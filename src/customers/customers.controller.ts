// src/customers/customers.controller.ts
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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from './guards/tenant-access.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, ListCustomersDto } from './dto';



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
}

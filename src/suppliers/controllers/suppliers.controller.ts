// src/suppliers/controllers/suppliers.controller.ts
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
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { SuppliersService } from '../services/suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { ListSuppliersDto } from '../dto/list-suppliers.dto';

@Controller('api/v1/tenants/:tenantId/customers/:customerId/suppliers')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() createSupplierDto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(
      tenantId,
      customerId,
      createSupplierDto,
    );
  }

  @Get()
  async findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query() queryParams: ListSuppliersDto,
  ) {
    return this.suppliersService.findAll(tenantId, customerId, queryParams);
  }

  @Get(':supplierId')
  async findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ) {
    return this.suppliersService.findOne(tenantId, customerId, supplierId);
  }

  @Put(':supplierId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() updateSupplierDto: CreateSupplierDto,
  ) {
    return this.suppliersService.update(
      tenantId,
      customerId,
      supplierId,
      updateSupplierDto,
    );
  }

  @Delete(':supplierId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ) {
    await this.suppliersService.remove(tenantId, customerId, supplierId);
  }
}

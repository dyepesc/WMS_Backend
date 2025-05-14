import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ListTenantsDto } from './dto/list-tenants.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('api/v1/admin/tenants')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async findAll(@Query() queryParams: ListTenantsDto) {
    return this.tenantService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tenantService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tenantService.remove(id);
  }
} 
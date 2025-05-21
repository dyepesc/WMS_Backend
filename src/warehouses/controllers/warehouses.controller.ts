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
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WarehouseTenantAccessGuard } from '../guards/tenant-access.guard';
import { WarehousesService } from '../services/warehouses.service';
import { CreateWarehouseDto } from '../dto/create-warehouses.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { ListWarehousesDto } from '../dto/list-warehouses.dto';

@Controller('api/v1/tenants/:tenantId/warehouses')
@UseGuards(JwtAuthGuard, WarehouseTenantAccessGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    const userId = req.user?.userId;
    return this.warehousesService.create(tenantId, createWarehouseDto, userId);
  }

  @Get()
  findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() queryParams: ListWarehousesDto,
  ) {
    return this.warehousesService.findAll(tenantId, queryParams);
  }

  @Get(':id')
  findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warehousesService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(tenantId, id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warehousesService.remove(tenantId, id);
  }
}

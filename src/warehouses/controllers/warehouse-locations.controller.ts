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
import { WarehouseLocationsService } from '../services/warehouse-locations.service';
import { CreateWarehouseLocationDto } from '../dto/create-warehouse-location.dto';
import { UpdateWarehouseLocationDto } from '../dto/update-warehouse-location.dto';

@Controller('api/v1/tenants/:tenantId/warehouses/:warehouseId/locations')
@UseGuards(JwtAuthGuard, WarehouseTenantAccessGuard)
export class WarehouseLocationsController {
  constructor(private readonly locationsService: WarehouseLocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() createLocationDto: CreateWarehouseLocationDto,
  ) {
    const userId = req.user?.userId;
    return this.locationsService.create(tenantId, warehouseId, userId, createLocationDto);
  }

  @Get()
  findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() query: any,
  ) {
    return this.locationsService.findAll(tenantId, warehouseId, query);
  }

  @Get(':id')
  findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.locationsService.findOne(tenantId, warehouseId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateWarehouseLocationDto,
  ) {
    return this.locationsService.update(tenantId, warehouseId, id, updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.locationsService.remove(tenantId, warehouseId, id);
  }
}

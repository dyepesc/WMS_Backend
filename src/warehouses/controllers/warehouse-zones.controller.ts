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
import { WarehouseZonesService } from '../services/warehouse-zones.service';
import { CreateWarehouseZoneDto } from '../dto/create-warehouse-zone.dto';
import { UpdateWarehouseZoneDto } from '../dto/update-warehouse-zone.dto';

@Controller('api/v1/tenants/:tenantId/warehouses/:warehouseId/zones')
@UseGuards(JwtAuthGuard, WarehouseTenantAccessGuard)
export class WarehouseZonesController {
  constructor(private readonly warehouseZonesService: WarehouseZonesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() createZoneDto: CreateWarehouseZoneDto,
  ) {
    const userId = req.user?.userId;
    return this.warehouseZonesService.create(tenantId, warehouseId, userId, createZoneDto);
  }

  @Get()
  findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() query: any,
  ) {
    return this.warehouseZonesService.findAll(tenantId, warehouseId, query);
  }

  @Get(':id')
  findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warehouseZonesService.findOne(tenantId, warehouseId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateWarehouseZoneDto,
  ) {
    return this.warehouseZonesService.update(tenantId, warehouseId, id, updateZoneDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.warehouseZonesService.remove(tenantId, warehouseId, id);
  }
}

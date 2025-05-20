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
  Req,
} from '@nestjs/common';
import { WarehouseZonesService } from '../services/warehouse-zones.service';
import { CreateWarehouseZoneDto } from '../dto/create-warehouse-zone.dto';
import { UpdateWarehouseZoneDto } from '../dto/update-warehouse-zone.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';

@Controller('api/v1/tenants/:tenantId/customers/:customerId/warehouses/:warehouseId/zones')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class WarehouseZonesController {
  constructor(private readonly warehouseZonesService: WarehouseZonesService) {}

  @Post()
  async create(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Req() req: RequestWithUser,
    @Body() createWarehouseZoneDto: CreateWarehouseZoneDto,
  ) {
    return this.warehouseZonesService.create(
      tenantId,
      customerId,
      warehouseId,
      req.user.id,
      createWarehouseZoneDto,
    );
  }

  @Get()
  findAll(
    @Param('tenantId') tenantId: number,
    @Param('warehouseId') warehouseId: number,
    @Query() query: any,
  ) {
    return this.warehouseZonesService.findAll(tenantId, warehouseId, query);
  }

  @Get(':id')
  async findOne(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
  ) {
    return this.warehouseZonesService.findOne(tenantId, customerId, warehouseId, id);
  }

  @Put(':id')
  async update(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
    @Body() updateWarehouseZoneDto: UpdateWarehouseZoneDto,
  ) {
    return this.warehouseZonesService.update(
      tenantId,
      customerId,
      warehouseId,
      id,
      updateWarehouseZoneDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
  ) {
    return this.warehouseZonesService.remove(tenantId, customerId, warehouseId, id);
  }
}

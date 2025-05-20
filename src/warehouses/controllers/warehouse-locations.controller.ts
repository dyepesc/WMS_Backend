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
import { WarehouseLocationsService } from '../services/warehouse-locations.service';
import { CreateWarehouseLocationDto } from '../dto/create-warehouse-location.dto';
import { UpdateWarehouseLocationDto } from '../dto/update-warehouse-location.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';

@Controller(
  'api/v1/tenants/:tenantId/customers/:customerId/warehouses/:warehouseId/locations',
)
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class WarehouseLocationsController {
  constructor(
    private readonly warehouseLocationsService: WarehouseLocationsService,
  ) {}

  @Post()
  async create(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Req() req: RequestWithUser,
    @Body() createWarehouseLocationDto: CreateWarehouseLocationDto,
  ) {
    return this.warehouseLocationsService.create(
      tenantId,
      customerId,
      warehouseId,
      req.user.id,
      createWarehouseLocationDto,
    );
  }

  @Get()
  findAll(
    @Param('tenantId') tenantId: number,
    @Param('warehouseId') warehouseId: number,
    @Query() query: any,
  ) {
    return this.warehouseLocationsService.findAll(tenantId, warehouseId, query);
  }

  @Get(':id')
  async findOne(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
  ) {
    return this.warehouseLocationsService.findOne(
      tenantId,
      customerId,
      warehouseId,
      id,
    );
  }

  @Put(':id')
  async update(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
    @Body() updateWarehouseLocationDto: UpdateWarehouseLocationDto,
  ) {
    return this.warehouseLocationsService.update(
      tenantId,
      customerId,
      warehouseId,
      id,
      updateWarehouseLocationDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('warehouseId') warehouseId: number,
    @Param('id') id: number,
  ) {
    return this.warehouseLocationsService.remove(
      tenantId,
      customerId,
      warehouseId,
      id,
    );
  }
}

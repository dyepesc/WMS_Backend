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
import { WarehousesService } from '../services/warehouses.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { ListWarehousesDto } from '../dto/list-warehouses.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';

@Controller('api/v1/tenants/:tenantId/customers/:customerId/warehouses')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  async create(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Req() req: RequestWithUser,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    return this.warehousesService.create(
      tenantId,
      customerId,
      req.user.id,
      createWarehouseDto,
    );
  }

  @Get()
  async findAll(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Query() listWarehousesDto: ListWarehousesDto,
  ) {
    return this.warehousesService.findAll(tenantId, customerId, listWarehousesDto);
  }

  @Get(':id')
  findOne(@Param('tenantId') tenantId: number, @Param('id') id: number) {
    return this.warehousesService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId') tenantId: number,
    @Param('id') id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(tenantId, id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('tenantId') tenantId: number, @Param('id') id: number) {
    return this.warehousesService.remove(tenantId, id);
  }
}

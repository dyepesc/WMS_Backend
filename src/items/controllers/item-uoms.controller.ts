// src/items/controllers/item-uoms.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ItemUomsService } from '../services/item-uoms.service';
import { CreateItemUomDto } from '../dto/create-item-uom.dto';
import { UpdateItemUomDto } from '../dto/update-item-uom.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';

interface RequestWithUser extends Request {
  user: {
    id: number;
    tenant_id: number;
    role: string;
  };
}

@Controller('api/v1/tenants/:tenantId/customers/:customerId/items/:itemId/uoms')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class ItemUomsController {
  constructor(private readonly itemUomsService: ItemUomsService) {}

  @Post()
  create(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('itemId') itemId: number,
    @Body() createItemUomDto: CreateItemUomDto,
  ) {
    return this.itemUomsService.create(
      tenantId,
      customerId,
      itemId,
      createItemUomDto,
    );
  }

  @Get()
  findAll(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('itemId') itemId: number,
    @Query() query: any,
  ) {
    return this.itemUomsService.findAll(tenantId, customerId, itemId, query);
  }

  @Get(':uomId')
  findOne(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('itemId') itemId: number,
    @Param('uomId') uomId: number,
  ) {
    return this.itemUomsService.findOne(tenantId, customerId, itemId, uomId);
  }

  @Put(':uomId')
  update(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('itemId') itemId: number,
    @Param('uomId') uomId: number,
    @Body() updateItemUomDto: UpdateItemUomDto,
  ) {
    return this.itemUomsService.update(
      tenantId,
      customerId,
      itemId,
      uomId,
      updateItemUomDto,
    );
  }

  @Delete(':uomId')
  remove(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('itemId') itemId: number,
    @Param('uomId') uomId: number,
  ) {
    return this.itemUomsService.remove(tenantId, customerId, itemId, uomId);
  }
}

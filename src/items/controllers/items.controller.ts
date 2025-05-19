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
import { ItemsService } from '../services/items.service';
import { CreateItemDto } from '../dto/create-items.dto';
import { UpdateItemDto } from '../dto/update-items.dto';
import { ListItemsDto } from '../dto/list-items.dto';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsString, IsEnum } from 'class-validator';

// Define the request interface
interface RequestWithUser extends Request {
  user: {
    id: number;
    tenant_id: number;
    role: string;
  };
}

@Controller('api/v1/tenants/:tenantId/customers/:customerId/items')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Body() createItemDto: CreateItemDto,
    @Request() req: RequestWithUser,
  ) {
    return this.itemsService.create(
      tenantId,
      customerId,
      req.user.id,
      createItemDto
    );
  }

  @Get()
  findAll(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Query() query: ListItemsDto,
  ) {
    return this.itemsService.findAll(tenantId, customerId, query);
  }

  @Get(':id')
  findOne(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('id') id: number,
  ) {
    return this.itemsService.findOne(tenantId, customerId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(tenantId, customerId, id, updateItemDto);
  }

  @Delete(':id')
  remove(
    @Param('tenantId') tenantId: number,
    @Param('customerId') customerId: number,
    @Param('id') id: number,
  ) {
    return this.itemsService.remove(tenantId, customerId, id);
  }
}

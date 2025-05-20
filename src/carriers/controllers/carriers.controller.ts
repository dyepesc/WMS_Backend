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
  BadRequestException,
} from '@nestjs/common';
import { CarriersService } from '../services/carriers.service';
import { CreateCarrierDto } from '../dto/create-carriers.dto';
import { UpdateCarrierDto } from '../dto/update-carriers.dto';
import { ListCarriersDto } from '../dto/list-carriers.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../../customers/guards/tenant-access.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';

@Controller('api/v1/tenants/:tenantId/carriers')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  async create(
    @Param('tenantId') tenantId: number,
    @Req() req: RequestWithUser,
    @Body() createCarrierDto: CreateCarrierDto,
  ) {
    // Debug the request user
    console.log('Request user:', req.user);

    if (!req.user) {
      throw new BadRequestException('User not found in request');
    }

    if (!req.user.id) {
      throw new BadRequestException('User ID not found in request');
    }

    return this.carriersService.create(tenantId, req.user.id, createCarrierDto);
  }

  @Get()
  findAll(
    @Param('tenantId') tenantId: number,
    @Query() query: ListCarriersDto,
  ) {
    return this.carriersService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@Param('tenantId') tenantId: number, @Param('id') id: number) {
    return this.carriersService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId') tenantId: number,
    @Param('id') id: number,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ) {
    return this.carriersService.update(tenantId, id, updateCarrierDto);
  }

  @Delete(':id')
  remove(@Param('tenantId') tenantId: number, @Param('id') id: number) {
    return this.carriersService.remove(tenantId, id);
  }
}

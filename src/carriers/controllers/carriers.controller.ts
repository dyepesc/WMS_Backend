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
  BadRequestException,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CarrierTenantAccessGuard } from '../guards/tenant-access.guard';
import { CarriersService } from '../services/carriers.service';
import { CreateCarrierDto } from '../dto/create-carriers.dto';
import { UpdateCarrierDto } from '../dto/update-carriers.dto';
import { ListCarriersDto } from '../dto/list-carriers.dto';

@Controller('api/v1/tenants/:tenantId/carriers')
@UseGuards(JwtAuthGuard, CarrierTenantAccessGuard)
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createCarrierDto: CreateCarrierDto,
  ) {
    // console.log('Request user:', req.user); // Debug log
    // console.log('Request headers:', req.headers); // Debug log

    // Get user ID from the request user object using userId instead of id
    const userId = req.user?.userId;
    // console.log('User ID:', userId); // Debug log

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.carriersService.create(tenantId, createCarrierDto, userId);
  }

  @Get()
  findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() queryParams: ListCarriersDto,
  ) {
    return this.carriersService.findAll(tenantId, queryParams);
  }

  @Get(':id')
  findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.carriersService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ) {
    return this.carriersService.update(tenantId, id, updateCarrierDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.carriersService.remove(tenantId, id);
  }
}

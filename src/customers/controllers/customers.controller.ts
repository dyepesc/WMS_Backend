import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ListCustomersDto } from '../dto/list-customers.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../guards/tenant-access.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('api/v1/tenants/:tenantId/customers')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.customersService.create(tenantId, createCustomerDto, userId);
  }

  @Get()
  findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() query: ListCustomersDto,
  ) {
    return this.customersService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.customersService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenantId, id, updateCustomerDto);
  }

  @Delete(':id')
  remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.customersService.remove(tenantId, id);
  }
}
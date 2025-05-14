// src/users/users.controller.ts
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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantAdminGuard } from './guards/tenant-admin.guard';
import { SuperAdminGuard } from '../tenants/guards/super-admin.guard';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './dto/user.dto';

@Controller('api/v1/admin/tenants')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':tenantId/initial-user')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async createInitialUser(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(tenantId, createUserDto);
  }

  @Post(':tenantId/users')
  @UseGuards(JwtAuthGuard, TenantAdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(tenantId, createUserDto);
  }

  // ... rest of the controller methods with updated paths
  @Get(':tenantId/users')
  @UseGuards(JwtAuthGuard, TenantAdminGuard)
  async findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() queryParams: ListUsersDto,
  ) {
    return this.usersService.findAll(tenantId, queryParams);
  }

  @Get(':tenantId/users/:userId')
  @UseGuards(JwtAuthGuard, TenantAdminGuard)
  async findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.findOne(tenantId, userId);
  }

  @Put(':tenantId/users/:userId')
  @UseGuards(JwtAuthGuard, TenantAdminGuard)
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(tenantId, userId, updateUserDto);
  }

  @Delete(':tenantId/users/:userId')
  @UseGuards(JwtAuthGuard, TenantAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.usersService.remove(tenantId, userId);
  }
}
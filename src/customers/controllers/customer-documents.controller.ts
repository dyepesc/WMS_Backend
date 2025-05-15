// src/customers/controllers/customer-documents.controller.ts
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
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantAccessGuard } from '../guards/tenant-access.guard';
import { CustomerDocumentsService } from '../services/customer-documents.service';
import {
  CreateCustomerDocumentDto,
  CreateExternalDocumentDto,
} from '../dto/create-customer-document.dto';
import { UpdateCustomerDocumentDto } from '../dto/update-customer-document.dto';
import { ListCustomerDocumentsDto } from '../dto/list-customer-documents.dto';
import { CustomerDocument } from '../entities/customer-document.entity';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { Express } from 'express';

@Controller('api/v1/tenants/:tenantId/customers/:customerId/documents')
@UseGuards(JwtAuthGuard, TenantAccessGuard)
export class CustomerDocumentsController {
  constructor(private readonly documentsService: CustomerDocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: CreateCustomerDocumentDto,
    @Request() req: RequestWithUser,
  ): Promise<CustomerDocument> {
    return this.documentsService.uploadDocument(
      tenantId,
      customerId,
      file,
      metadata,
      req.user,
    );
  }

  @Post('external')
  async createExternalDocument(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() createDto: CreateExternalDocumentDto,
    @Request() req: RequestWithUser,
  ): Promise<CustomerDocument> {
    return this.documentsService.createExternalDocument(
      tenantId,
      customerId,
      createDto,
      req.user,
    );
  }

  @Get()
  async findAll(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query() queryParams: ListCustomerDocumentsDto,
  ): Promise<PaginatedResponse<CustomerDocument>> {
    return this.documentsService.findAll(tenantId, customerId, queryParams);
  }

  @Get(':documentId')
  async findOne(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<CustomerDocument> {
    return this.documentsService.findOne(tenantId, customerId, documentId);
  }

  @Put(':documentId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() updateDto: UpdateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    return this.documentsService.update(
      tenantId,
      customerId,
      documentId,
      updateDto,
    );
  }

  @Delete(':documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<void> {
    await this.documentsService.remove(tenantId, customerId, documentId);
  }
}

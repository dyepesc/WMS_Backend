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
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
  } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { CustomerContactsService } from '../services/customer-contacts.service';
  import { CreateCustomerContactDto } from '../dto/create-customer-contact.dto';
  import { UpdateCustomerContactDto } from '../dto/update-customer-contact.dto';
  import { ListCustomerContactsDto } from '../dto/list-customer-contacts.dto';
  import { TenantAccessGuard } from '../guards/tenant-access.guard';
  
  @ApiTags('Customer Contacts')
  @Controller('api/v1/tenants/:tenantId/customers/:customerId/contacts')
  @UseGuards(JwtAuthGuard, TenantAccessGuard)
  export class CustomerContactsController {
    constructor(private readonly contactsService: CustomerContactsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new customer contact' })
    @ApiParam({ name: 'tenantId', description: 'ID of the tenant' })
    @ApiParam({ name: 'customerId', description: 'ID of the customer' })
    @ApiResponse({
      status: 201,
      description: 'Contact created successfully',
      type: CreateCustomerContactDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    create(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Body() createDto: CreateCustomerContactDto,
    ) {
      return this.contactsService.create(tenantId, customerId, createDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'List all contacts for a customer' })
    @ApiParam({ name: 'tenantId', description: 'ID of the tenant' })
    @ApiParam({ name: 'customerId', description: 'ID of the customer' })
    @ApiQuery({ type: ListCustomerContactsDto })
    @ApiResponse({ 
      status: 200, 
      description: 'Contacts retrieved successfully',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateCustomerContactDto' }
          },
          pagination: {
            type: 'object',
            properties: {
              totalItems: { type: 'number' },
              totalPages: { type: 'number' },
              currentPage: { type: 'number' },
              limit: { type: 'number' }
            }
          }
        }
      }
    })
    findAll(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Query() query: ListCustomerContactsDto,
    ) {
      return this.contactsService.findAll(tenantId, customerId, query);
    }
  
    @Get(':contactId')
    @ApiOperation({ summary: 'Get a specific contact' })
    @ApiParam({ name: 'tenantId', description: 'ID of the tenant' })
    @ApiParam({ name: 'customerId', description: 'ID of the customer' })
    @ApiParam({ name: 'contactId', description: 'ID of the contact' })
    @ApiResponse({
      status: 200,
      description: 'Contact retrieved successfully',
      type: CreateCustomerContactDto
    })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    findOne(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
    ) {
      return this.contactsService.findOne(tenantId, customerId, contactId);
    }
  
    @Put(':contactId')
    @ApiOperation({ summary: 'Update a contact' })
    @ApiParam({ name: 'tenantId', description: 'ID of the tenant' })
    @ApiParam({ name: 'customerId', description: 'ID of the customer' })
    @ApiParam({ name: 'contactId', description: 'ID of the contact' })
    @ApiResponse({
      status: 200,
      description: 'Contact updated successfully',
      type: CreateCustomerContactDto
    })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    update(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
      @Body() updateDto: UpdateCustomerContactDto,
    ) {
      return this.contactsService.update(tenantId, customerId, contactId, updateDto);
    }
  
    @Delete(':contactId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a contact' })
    @ApiParam({ name: 'tenantId', description: 'ID of the tenant' })
    @ApiParam({ name: 'customerId', description: 'ID of the customer' })
    @ApiParam({ name: 'contactId', description: 'ID of the contact' })
    @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    remove(
      @Param('tenantId', ParseIntPipe) tenantId: number,
      @Param('customerId', ParseIntPipe) customerId: number,
      @Param('contactId', ParseIntPipe) contactId: number,
    ) {
      return this.contactsService.remove(tenantId, customerId, contactId);
    }
  }
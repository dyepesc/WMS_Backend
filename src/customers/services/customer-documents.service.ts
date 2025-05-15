import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDocument } from '../entities/customer-document.entity';
import { Customer } from '../entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateCustomerDocumentDto,
  CreateExternalDocumentDto,
} from '../dto/create-customer-document.dto';
import { UpdateCustomerDocumentDto } from '../dto/update-customer-document.dto';
import { ListCustomerDocumentsDto } from '../dto/list-customer-documents.dto';
import { StorageService } from '../../common/services/storage.service';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class CustomerDocumentsService {
  constructor(
    @InjectRepository(CustomerDocument)
    private documentRepository: Repository<CustomerDocument>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private storageService: StorageService,
  ) {}

  async uploadDocument(
    tenantId: number,
    customerId: number,
    file: Express.Multer.File,
    metadata: CreateCustomerDocumentDto,
    currentUser: User,
  ): Promise<CustomerDocument> {
    const customer = await this.validateCustomer(tenantId, customerId);

    const s3Key = await this.storageService.uploadFile(
      file,
      `tenant${tenantId}/customer${customerId}/docs`,
    );

    const document = this.documentRepository.create({
      tenantId,
      customerId,
      filename: file.originalname,
      originalFilename: file.originalname,
      mimetype: file.mimetype,
      fileSize: file.size,
      s3Key,
      documentType: metadata.documentType,
      title: metadata.title,
      description: metadata.description,
      uploadedByUserId: currentUser.id,
    });

    return this.documentRepository.save(document);
  }

  async createExternalDocument(
    tenantId: number,
    customerId: number,
    createDto: CreateExternalDocumentDto,
    currentUser: User,
  ): Promise<CustomerDocument> {
    const customer = await this.validateCustomer(tenantId, customerId);

    const document = this.documentRepository.create({
      tenantId,
      customerId,
      isExternalLink: true,
      externalUrl: createDto.externalUrl,
      documentType: createDto.documentType,
      title: createDto.title,
      description: createDto.description,
      uploadedByUserId: currentUser.id,
    });

    return this.documentRepository.save(document);
  }

  async findAll(
    tenantId: number,
    customerId: number,
    queryParams: ListCustomerDocumentsDto,
  ): Promise<PaginatedResponse<CustomerDocument>> {
    await this.validateCustomer(tenantId, customerId);

    const {
      documentType,
      title,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryParams;

    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .where('document.tenantId = :tenantId', { tenantId })
      .andWhere('document.customerId = :customerId', { customerId });

    if (documentType) {
      queryBuilder.andWhere('document.documentType = :documentType', {
        documentType,
      });
    }

    if (title) {
      queryBuilder.andWhere('document.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('document.status = :status', { status });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .orderBy(`document.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [documents, total] = await queryBuilder.getManyAndCount();

    // Generate signed URLs for documents
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        if (doc.s3Key) {
          doc.fileUrl = await this.storageService.getSignedUrl(doc.s3Key);
        }
        return doc;
      }),
    );

    return {
      data: documentsWithUrls,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async findOne(
    tenantId: number,
    customerId: number,
    documentId: number,
  ): Promise<CustomerDocument> {
    const document = await this.documentRepository.findOne({
      where: {
        id: documentId,
        tenantId,
        customerId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.s3Key) {
      document.fileUrl = await this.storageService.getSignedUrl(document.s3Key);
    }

    return document;
  }

  async remove(
    tenantId: number,
    customerId: number,
    documentId: number,
  ): Promise<void> {
    const document = await this.findOne(tenantId, customerId, documentId);

    if (document.s3Key) {
      await this.storageService.deleteFile(document.s3Key);
    }

    await this.documentRepository.remove(document);
  }

  async update(
    tenantId: number,
    customerId: number,
    documentId: number,
    updateDto: UpdateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    const document = await this.findOne(tenantId, customerId, documentId);

    const updatedDocument = this.documentRepository.create({
      ...document,
      ...updateDto,
    });

    return this.documentRepository.save(updatedDocument);
  }

  private async validateCustomer(
    tenantId: number,
    customerId: number,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${customerId} not found or does not belong to tenant ${tenantId}`,
      );
    }

    return customer;
  }
}

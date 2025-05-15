import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CustomersController } from './controllers/customers.controller';
import { CustomerContactsController } from './controllers/customer-contacts.controller';
import { CustomerDocumentsController } from './controllers/customer-documents.controller';
import { CustomersService } from './services/customers.service';
import { CustomerContactsService } from './services/customer-contacts.service';
import { CustomerDocumentsService } from './services/customer-documents.service';
import { StorageService } from '../common/services/storage.service';
import { Customer } from './entities/customer.entity';
import { CustomerContact } from './entities/customer-contact.entity';
import { CustomerDocument } from './entities/customer-document.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerContact, CustomerDocument, User]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  ],
  controllers: [
    CustomersController,
    CustomerContactsController,
    CustomerDocumentsController,
  ],
  providers: [
    CustomersService,
    CustomerContactsService,
    CustomerDocumentsService,
    StorageService,
  ],
})
export class CustomersModule {}
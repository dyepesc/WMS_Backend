// src/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './controllers/customers.controller';
import { CustomerContactsController } from './controllers/customer-contacts.controller';
import { CustomersService } from './services/customers.service';
import { CustomerContactsService } from './services/customer-contacts.service';
import { Customer } from './entities/customer.entity';
import { CustomerContact } from './entities/customer-contact.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerContact, User])],
  controllers: [CustomersController, CustomerContactsController],
  providers: [CustomersService, CustomerContactsService],
})
export class CustomersModule {}
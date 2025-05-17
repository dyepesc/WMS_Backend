// src/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerContact } from './entities/customer-contact.entity';
import { CustomerContactsController } from './controllers/customer-contacts.controller';
import { CustomerContactsService } from './services/customer-contacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerContact])],
  controllers: [CustomerContactsController],
  providers: [CustomerContactsService],
  exports: [CustomerContactsService],
})
export class CustomersModule {}

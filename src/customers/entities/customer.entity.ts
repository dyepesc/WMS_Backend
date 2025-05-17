// src/customers/entities/customer.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';
import { CustomerContact } from './customer-contact.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'legal_name', nullable: true })
  legalName: string;

  @Column({ name: 'tax_id', nullable: true })
  taxId: string;

  @Column({ name: 'entity_type', default: 'company' })
  entityType: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  city: string;

  @Column({ name: 'state_province', nullable: true })
  stateProvince: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'payment_terms', default: 'net-30' })
  paymentTerms: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    name: 'credit_limit',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  creditLimit: number;

  @Column({ name: 'account_manager_id', nullable: true })
  accountManagerId: number;

  @Column({ name: 'receiving_hours', type: 'jsonb', nullable: true })
  receivingHours: Record<string, { open: string; close: string }>;

  @Column({ name: 'shipping_hours', type: 'jsonb', nullable: true })
  shippingHours: Record<string, { open: string; close: string }>;

  @Column({ name: 'special_instructions', nullable: true })
  specialInstructions: string;

  @Column({ name: 'allows_backorders', default: true })
  allowsBackorders: boolean;

  @Column({ name: 'requires_appointment_for_receiving', default: false })
  requiresAppointmentForReceiving: boolean;

  @Column({ name: 'requires_appointment_for_shipping', default: false })
  requiresAppointmentForShipping: boolean;

  @Column({ name: 'inventory_method', default: 'FEFO' })
  inventoryMethod: string;

  @Column({ name: 'integration_code', nullable: true })
  integrationCode: string;

  @Column({ name: 'portal_access', default: false })
  portalAccess: boolean;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'created_by_user_id' })
  createdByUserId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'account_manager_id' })
  accountManager: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @OneToMany(() => CustomerContact, (contact) => contact.customer)
  contacts: CustomerContact[];
}

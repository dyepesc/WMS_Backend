import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_contacts')
export class CustomerContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  department: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ name: 'notification_preferences', type: 'json', nullable: true })
  notificationPreferences: Record<string, string[]>;

  @Column({ name: 'has_portal_access', default: false })
  hasPortalAccess: boolean;

  @Column({ name: 'portal_user_id', nullable: true })
  portalUserId: number;

  @Column({ name: 'portal_access_level', nullable: true })
  portalAccessLevel: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.contacts)
  customer: Customer;
}
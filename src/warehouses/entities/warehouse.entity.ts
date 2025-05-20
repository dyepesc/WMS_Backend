import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { WarehouseZone } from './warehouse-zone.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ name: 'customer_id' })
  customer_id: number;

  @Column({ name: 'created_by_user_id' })
  created_by_user_id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column()
  city: string;

  @Column({ name: 'state_province' })
  stateProvince: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column()
  country: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ name: 'time_zone' })
  timeZone: string;

  @Column({ name: 'measurement_standard' })
  measurementStandard: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @OneToMany(() => WarehouseZone, (zone) => zone.warehouse)
  zones: WarehouseZone[];
}

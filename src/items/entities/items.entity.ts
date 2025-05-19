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
import { ItemUom } from './item-uom.entity';

export enum ItemType {
  STANDARD = 'standard',
  FINISHED = 'finished',
  PACKAGING = 'packaging',
  SERVICE = 'service'
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'created_by_user_id' })
  createdByUserId: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ 
    name: 'item_type',
    type: 'enum',
    enum: ItemType,
    default: ItemType.STANDARD
  })
  itemType: ItemType;

  @Column()
  status: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_hazmat', default: false })
  isHazmat: boolean;

  @Column({ name: 'min_on_hand', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOnHand: number;

  @Column({ name: 'max_on_hand', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxOnHand: number;

  @Column({ name: 'reorder_point', type: 'decimal', precision: 10, scale: 2, nullable: true })
  reorderPoint: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'customs_commodity_code', nullable: true })
  customsCommodityCode: string;

  @Column({ name: 'country_of_origin', nullable: true })
  countryOfOrigin: string;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitCost: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ name: 'dimension_unit', nullable: true })
  dimensionUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ name: 'weight_unit', nullable: true })
  weightUnit: string;

  @Column({ name: 'serial_number_tracking', nullable: true })
  serialNumberTracking: string;

  @Column({ name: 'expiration_date_tracking', default: false })
  expirationDateTracking: boolean;

  @Column({ name: 'lot_number_tracking', nullable: true })
  lotNumberTracking: string;

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
  creator: User;

  @OneToMany(() => ItemUom, (uom) => uom.item)
  unitConversions: ItemUom[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseZone } from './warehouse-zone.entity';
import { User } from '../../users/entities/user.entity';

@Entity('warehouse_locations')
export class WarehouseLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ name: 'warehouse_id' })
  warehouse_id: number;

  @Column({ name: 'zone_id' })
  zone_id: number;

  @Column({ name: 'created_by' })
  created_by: number;

  @Column({ name: 'location_barcode' })
  locationBarcode: string;

  @Column()
  aisle: string;

  @Column()
  rack: string;

  @Column()
  level: string;

  @Column()
  position: string;

  @Column({ name: 'capacity_weight_kg', type: 'decimal', precision: 10, scale: 2 })
  capacityWeightKg: number;

  @Column({ name: 'capacity_volume_cubic_meters', type: 'decimal', precision: 10, scale: 2 })
  capacityVolumeCubicMeters: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_mixed_items_allowed' })
  isMixedItemsAllowed: boolean;

  @Column({ name: 'is_mixed_customers_allowed' })
  isMixedCustomersAllowed: boolean;

  @Column({ name: 'is_mixed_tenants_allowed' })
  isMixedTenantsAllowed: boolean;

  @Column()
  status: string;

  @Column({ name: 'allow_mixed_items', default: true })
  allowMixedItems: boolean;

  @Column({ name: 'allow_mixed_lots', default: false })
  allowMixedLots: boolean;

  @Column({ name: 'allow_mixed_customers', default: true })
  allowMixedCustomers: boolean;

  @Column({ name: 'pick_sequence', nullable: true })
  pickSequence: number;

  @Column({ name: 'putaway_sequence', nullable: true })
  putawaySequence: number;

  @Column({ name: 'custom_field1', nullable: true })
  customField1: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseZone)
  @JoinColumn({ name: 'zone_id' })
  zone: WarehouseZone;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}

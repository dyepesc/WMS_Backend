import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouses.entity';
import { WarehouseZone } from './warehouse-zone.entity';

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

  @Column({ name: 'location_barcode' })
  locationBarcode: string;

  @Column()
  aisle: string;

  @Column({ name: 'rack' })
  rack: string;

  @Column()
  level: string;

  @Column()
  position: string;

  @Column({ name: 'location_type' })
  locationType: string;

  @Column({ name: 'capacity_weight_kg' })
  capacityWeightKg: number;

  @Column({ name: 'capacity_volume_cbm' })
  capacityVolumeCbm: number;

  @Column({ name: 'dimension_length_cm' })
  dimensionLengthCm: number;

  @Column({ name: 'dimension_width_cm' })
  dimensionWidthCm: number;

  @Column({ name: 'dimension_height_cm' })
  dimensionHeightCm: number;

  @Column()
  status: string;

  @Column({ name: 'allow_mixed_items' })
  allowMixedItems: boolean;

  @Column({ name: 'allow_mixed_lots' })
  allowMixedLots: boolean;

  @Column({ name: 'allow_mixed_customers' })
  allowMixedCustomers: boolean;

  @Column({ name: 'pick_sequence' })
  pickSequence: number;

  @Column({ name: 'putaway_sequence' })
  putawaySequence: number;

  @Column({ name: 'custom_field1' })
  customField1: string;

  @Column({ name: 'created_by' })
  createdByUserId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseZone, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: WarehouseZone;
}

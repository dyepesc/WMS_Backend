import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './items.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('item_unit_conversions')
export class ItemUom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column()
  uom: string;

  @Column({
    name: 'conversion_factor',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  conversionFactor: number;

  @Column({ name: 'is_base_unit', default: false })
  isBaseUnit: boolean;

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

  @Column({ nullable: true })
  barcode: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Item, (item) => item.unitConversions)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}

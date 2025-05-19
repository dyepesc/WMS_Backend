import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from './items.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('item_unit_conversions')
export class ItemUnitConversion {
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

  @Column({ nullable: true })
  barcode: string;

  @ManyToOne(() => Item, (item) => item.unitConversions)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}

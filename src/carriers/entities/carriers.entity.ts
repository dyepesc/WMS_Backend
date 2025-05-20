import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenant_id: number;

  @Column({ name: 'created_by', nullable: false })
  created_by: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ name: 'service_types', type: 'jsonb', nullable: true })
  serviceTypes: string[];

  @Column({ name: 'contact_name', nullable: true })
  contactName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'tracking_url_template', nullable: true })
  trackingUrlTemplate: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

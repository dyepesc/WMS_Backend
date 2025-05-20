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
  import { User } from '../../users/entities/user.entity';
  
  @Entity('carriers')
  export class Carrier {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'tenant_id' })
    tenant_id: number;
  
    @Column({ name: 'created_by' })
    created_by: number;
  
    @Column()
    name: string;
  
    @Column({ nullable: true })
    code: string;
  
    @Column('jsonb', { name: 'service_types', nullable: true })
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
  
    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;
  }
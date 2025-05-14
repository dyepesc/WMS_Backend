import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('tenant_settings')
export class TenantSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'tenant_id' })
    tenantId: number;

    @Column({ name: 'setting_key' })
    settingKey: string;

    @Column({ name: 'setting_value', type: 'text' })
    settingValue: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'data_type', default: 'string' })
    dataType: string;

    @Column({ name: 'is_editable_by_tenant', default: true })
    isEditableByTenant: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Tenant)
    tenant: Tenant;
}
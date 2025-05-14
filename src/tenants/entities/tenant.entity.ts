import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { TenantSetting } from './tenant-setting.entity';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive'],
        default: 'active'
    })
    status: string;

    @Column({ name: 'subscription_plan_id' })
    subscriptionPlanId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => TenantSetting, setting => setting.tenant)
    settings: TenantSetting[];
}
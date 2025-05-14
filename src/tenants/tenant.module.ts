import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantSettingsController } from './tenant-settings.controller';
import { TenantSettingsService } from './tenant-settings.service';
import { Tenant } from './entities/tenant.entity';
import { TenantSetting } from './entities/tenant-setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant, TenantSetting])],
    controllers: [TenantController, TenantSettingsController],
    providers: [TenantService, TenantSettingsService],
})
export class TenantModule {} 
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantSetting } from './entities/tenant-setting.entity';
import { ListTenantSettingsDto, UpsertTenantSettingDto } from './dto/tenant-setting.dto';

@Injectable()
export class TenantSettingsService {
    constructor(
        @InjectRepository(TenantSetting)
        private tenantSettingRepository: Repository<TenantSetting>,
    ) {}

    async findAll(tenantId: number, queryParams: ListTenantSettingsDto) {
        const { page = 1, limit = 100 } = queryParams;
        const skip = (page - 1) * limit;

        const [settings, total] = await this.tenantSettingRepository.findAndCount({
            where: { tenantId },
            skip,
            take: limit,
            order: { settingKey: 'ASC' },
        });

        return {
            data: settings,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        };
    }

    async findOne(tenantId: number, settingKey: string) {
        const setting = await this.tenantSettingRepository.findOne({
            where: { tenantId, settingKey },
        });

        if (!setting) {
            throw new NotFoundException(`Setting with key ${settingKey} not found for tenant ${tenantId}`);
        }

        return setting;
    }

    async upsert(tenantId: number, settingKey: string, dto: UpsertTenantSettingDto) {
        // Validate setting value against data type
        this.validateSettingValue(dto.settingValue, dto.dataType);

        let setting = await this.tenantSettingRepository.findOne({
            where: { tenantId, settingKey },
        });

        if (setting) {
            // Update
            Object.assign(setting, dto);
            setting = await this.tenantSettingRepository.save(setting);
            return { setting, isNew: false };
        } else {
            // Create
            setting = this.tenantSettingRepository.create({
                tenantId,
                settingKey,
                ...dto,
            });
            setting = await this.tenantSettingRepository.save(setting);
            return { setting, isNew: true };
        }
    }

    async remove(tenantId: number, settingKey: string) {
        const setting = await this.findOne(tenantId, settingKey);
        await this.tenantSettingRepository.remove(setting);
    }

    private validateSettingValue(value: string, dataType: string = 'string') {
        switch (dataType) {
            case 'number':
                if (isNaN(Number(value))) {
                    throw new BadRequestException('Invalid number value');
                }
                break;
            case 'boolean':
                if (!['true', 'false'].includes(value.toLowerCase())) {
                    throw new BadRequestException('Invalid boolean value');
                }
                break;
            case 'json':
                try {
                    JSON.parse(value);
                } catch (e) {
                    throw new BadRequestException('Invalid JSON value');
                }
                break;
        }
    }
}
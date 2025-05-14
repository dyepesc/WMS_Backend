import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { TenantSettingsService } from './tenant-settings.service';
import { ListTenantSettingsDto, UpsertTenantSettingDto } from './dto/tenant-setting.dto';

@Controller('api/v1/admin/tenants')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class TenantSettingsController {
    constructor(private readonly tenantSettingsService: TenantSettingsService) {}

    @Get(':tenantId/settings')
    async findAll(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Query() queryParams: ListTenantSettingsDto,
    ) {
        return this.tenantSettingsService.findAll(tenantId, queryParams);
    }

    @Get(':tenantId/settings/:settingKey')
    async findOne(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Param('settingKey') settingKey: string,
    ) {
        return this.tenantSettingsService.findOne(tenantId, settingKey);
    }

    @Put(':tenantId/settings/:settingKey')
    async upsert(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Param('settingKey') settingKey: string,
        @Body() dto: UpsertTenantSettingDto,
    ) {
        const { setting, isNew } = await this.tenantSettingsService.upsert(tenantId, settingKey, dto);
        return {
            statusCode: isNew ? HttpStatus.CREATED : HttpStatus.OK,
            data: setting,
        };
    }

    @Delete(':tenantId/settings/:settingKey')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('tenantId', ParseIntPipe) tenantId: number,
        @Param('settingKey') settingKey: string,
    ) {
        await this.tenantSettingsService.remove(tenantId, settingKey);
    }
}
import { IsString, IsBoolean, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ListTenantSettingsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 100;
}

export class UpsertTenantSettingDto {
    @IsString()
    settingValue: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @IsIn(['string', 'number', 'boolean', 'json'])
    dataType?: string = 'string';

    @IsOptional()
    @IsBoolean()
    isEditableByTenant?: boolean;
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesController } from './controllers/warehouses.controller';
import { WarehousesService } from './services/warehouses.service';
import { Warehouse } from './entities/warehouses.entity';
import { WarehouseZone } from './entities/warehouse-zone.entity';
import { WarehouseLocation } from './entities/warehouse-location.entity';
import { WarehouseZonesController } from './controllers/warehouse-zones.controller';
import { WarehouseZonesService } from './services/warehouse-zones.service';
import { WarehouseLocationsController } from './controllers/warehouse-locations.controller';
import { WarehouseLocationsService } from './services/warehouse-locations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      WarehouseZone,
      WarehouseLocation,
    ]),
  ],
  controllers: [
    WarehousesController,
    WarehouseZonesController,
    WarehouseLocationsController,
  ],
  providers: [
    WarehousesService,
    WarehouseZonesService,
    WarehouseLocationsService,
  ],
  exports: [WarehousesService],
})
export class WarehousesModule {}

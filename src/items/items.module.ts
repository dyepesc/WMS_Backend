import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './controllers/items.controller';
import { ItemUomsController } from './controllers/item-uoms.controller';
import { ItemsService } from './services/items.service';
import { ItemUomsService } from './services/item-uoms.service';
import { Item } from './entities/items.entity';
import { ItemUom } from './entities/item-uom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemUom])],
  controllers: [ItemsController, ItemUomsController],
  providers: [ItemsService, ItemUomsService],
  exports: [ItemsService, ItemUomsService],
})
export class ItemsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './controllers/items.controller';
import { ItemsService } from './services/items.service';
import { Item } from './entities/items.entity';
import { ItemUnitConversion } from './entities/item-unit-conversion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemUnitConversion])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
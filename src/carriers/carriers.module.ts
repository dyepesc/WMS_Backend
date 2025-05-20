import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carriers.entity';
import { CarriersService } from './services/carriers.service';
import { CarriersController } from './controllers/carriers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier])],
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}

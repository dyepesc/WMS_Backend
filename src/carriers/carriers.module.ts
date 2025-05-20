import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarriersController } from './controllers/carriers.controller';
import { CarriersService } from './services/carriers.service';
import { Carrier } from './entities/carriers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier])],
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}

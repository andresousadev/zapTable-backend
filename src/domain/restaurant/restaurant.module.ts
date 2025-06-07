import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { RestaurantController } from './controllers/restaurant.controller';
import { TableController } from './controllers/table.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';
import { RestaurantService } from './services/restaurant.service';
import { TableService } from './services/table.service';

@Module({
  imports: [MikroOrmModule.forFeature([Restaurant, Table]), CatalogModule],
  controllers: [RestaurantController, TableController],
  providers: [RestaurantService, TableService],
})
export class RestaurantModule {}

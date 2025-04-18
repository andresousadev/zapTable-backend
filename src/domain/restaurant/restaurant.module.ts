import { Module } from '@nestjs/common';
import { BusinessController } from './controllers/business.controller';
import { RestaurantController } from './controllers/restaurant.controller';
import { TableController } from './controllers/table.controller';
import { BusinessService } from './services/business.service';
import { RestaurantService } from './services/restaurant.service';
import { TableService } from './services/table.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Business } from './entities/business.entity';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Business, Restaurant, Table])],
  controllers: [BusinessController, RestaurantController, TableController],
  providers: [BusinessService, RestaurantService, TableService],
})
export class RestaurantModule {}

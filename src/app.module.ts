import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { config } from './mikro-orm.config';
import { CatalogModule } from './domain/catalog/catalog.module';
import { RestaurantModule } from './domain/restaurant/restaurant.module';
import { UserModule } from './domain/user/user.module';
import { OrderModule } from './domain/order/order.module';
@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    RestaurantModule,
    CatalogModule,
    UserModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

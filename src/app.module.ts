import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './domain/business/business.module';
import { CatalogModule } from './domain/catalog/catalog.module';
import { OrderModule } from './domain/order/order.module';
import { RestaurantModule } from './domain/restaurant/restaurant.module';
import { UserModule } from './domain/user/user.module';
import mikroOrmConfig from './mikro-orm.config';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development.local'] }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    BusinessModule,
    RestaurantModule,
    CatalogModule,
    UserModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './domain/business/business.module';
import { CatalogModule } from './domain/catalog/catalog.module';
import { OrderModule } from './domain/order/order.module';
import { RestaurantModule } from './domain/restaurant/restaurant.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './mikro-orm.config';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development.local'] }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    CommonModule,
    BusinessModule,
    RestaurantModule,
    CatalogModule,
    UserModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

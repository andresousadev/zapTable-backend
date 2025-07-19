import { AuthModule } from '@app/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Business } from '../business/entities/business.entity';
import { UserModule } from '../user/user.module';
import { CategoryController } from './controllers/category.controller';
import { IngredientController } from './controllers/ingredient.controller';
import { ProductController } from './controllers/product.controller';
import { MenuController } from './controllers/menu.controller';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingredient.entity';
import { ProductAvailability } from './entities/product-availability.entity';
import { ProductCustomization } from './entities/product-customization.entity';
import { ProductPrice } from './entities/product-price.entity';
import { Product } from './entities/product.entity';
import { Menu } from './entities/menu.entity';
import { CategoryService } from './services/category.service';
import { IngredientService } from './services/ingredient.service';
import { ProductService } from './services/product.service';
import { MenuService } from './services/menu.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Category,
      Ingredient,
      Menu,
      ProductAvailability,
      ProductCustomization,
      ProductPrice,
      Product,
      Business,
    ]),
    UserModule,
    AuthModule,
  ],
  exports: [CatalogModule],
  controllers: [
    IngredientController,
    MenuController,
    ProductController,
    CategoryController,
  ],
  providers: [IngredientService, MenuService, ProductService, CategoryService],
})
export class CatalogModule {}

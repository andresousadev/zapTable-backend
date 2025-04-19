import { Module } from '@nestjs/common';
import { IngredientService } from './services/ingredient.service';
import { MenuService } from './services/menu.service';
import { ProductService } from './services/product.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Ingredient } from './entities/ingredient.entity';
import { Menu } from './entities/menu.entity';
import { Product } from './entities/product.entity';
import { IngredientController } from './controllers/ingredient.controller';
import { MenuController } from './controllers/menu.controller';
import { ProductController } from './controllers/product.controller';
import { Category } from './entities/category.entity';
import { ProductAvailability } from './entities/product-availability.entity';
import { ProductCustomization } from './entities/product-customization.entity';
import { ProductPrice } from './entities/product-price.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';

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
    ]),
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

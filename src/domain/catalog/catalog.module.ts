import { Module } from '@nestjs/common';
import { IngredientController } from './controllers/ingredient.controller';
import { MenuController } from './controllers/menu.controller';
import { ProductController } from './controllers/product.controller';
import { IngredientService } from './services/ingredient.service';
import { MenuService } from './services/menu.service';
import { ProductService } from './services/product.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Ingredient } from './entities/ingredient.entity';
import { Menu } from './entities/menu.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Ingredient, Menu, Product])],
  controllers: [IngredientController, MenuController, ProductController],
  providers: [IngredientService, MenuService, ProductService],
})
export class CatalogModule {}

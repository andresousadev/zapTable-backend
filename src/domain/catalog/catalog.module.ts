import { AuthModule } from '@app/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Business } from '../business/entities/business.entity';
import { UserModule } from '../user/user.module';
import { CategoryController } from './controllers/category.controller';
import { IngredientController } from './controllers/ingredient.controller';
import { MealController } from './controllers/meal.controller';
import { MenuController } from './controllers/menu.controller';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingredient.entity';
import { MealAvailability } from './entities/meal-availability.entity';
import { MealCustomization } from './entities/meal-customization.entity';
import { MealPrice } from './entities/meal-price.entity';
import { Meal } from './entities/meal.entity';
import { Menu } from './entities/menu.entity';
import { CategoryService } from './services/category.service';
import { IngredientService } from './services/ingredient.service';
import { MealService } from './services/meal.service';
import { MenuService } from './services/menu.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Category,
      Ingredient,
      Menu,
      MealAvailability,
      MealCustomization,
      MealPrice,
      Meal,
      Business,
    ]),
    UserModule,
    AuthModule,
  ],
  exports: [CatalogModule],
  controllers: [
    IngredientController,
    MenuController,
    MealController,
    CategoryController,
  ],
  providers: [IngredientService, MenuService, MealService, CategoryService],
})
export class CatalogModule {}

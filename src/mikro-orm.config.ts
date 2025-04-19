import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Category } from './domain/catalog/entities/category.entity';
import { Ingredient } from './domain/catalog/entities/ingredient.entity';
import { Menu } from './domain/catalog/entities/menu.entity';
import { Product } from './domain/catalog/entities/product.entity';
import { Business } from './domain/restaurant/entities/business.entity';
import { Restaurant } from './domain/restaurant/entities/restaurant.entity';
import { Table } from './domain/restaurant/entities/table.entity';
import { Admin } from './domain/user/entities/admin.entity';
import { Owner } from './domain/user/entities/owner.entity';
import { Staff } from './domain/user/entities/staff.entity';
import { ProductAvailability } from './domain/catalog/entities/product-availability.entity';
import { ProductCustomization } from './domain/catalog/entities/product-customization.entity';
import { ProductPrice } from './domain/catalog/entities/product-price.entity';
import { Migrator } from '@mikro-orm/migrations';
import { User } from './domain/user/entities/user.entity';

export default defineConfig({
  host: 'db',
  port: 5432,
  user: 'zapTable',
  password: 'zapTable',
  dbName: 'zapTable',
  driver: PostgreSqlDriver,
  entities: [
    Category,
    Ingredient,
    Menu,
    ProductAvailability,
    ProductCustomization,
    ProductPrice,
    Product,
    Business,
    Restaurant,
    Table,
    Admin,
    Owner,
    Staff,
    User,
  ],
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
});

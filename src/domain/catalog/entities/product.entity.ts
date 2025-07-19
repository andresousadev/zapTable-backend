import { Business } from '@app/domain/business/entities/business.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Category } from './category.entity';
import { ProductAvailability } from './product-availability.entity';
import { Ingredient } from './ingredient.entity';
import { ProductPrice } from './product-price.entity';
import { ProductCustomization } from './product-customization.entity';

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Product {
  // Necessary to create entity without having to provide every field defined here
  [OptionalProps]?:
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'categories'
    | 'ingredients'
    | 'availabilities'
    | 'prices'
    | 'customizations';

  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  defaultPrice!: string;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business!: Business;

  @ManyToMany(() => Category, (c) => c.products)
  categories = new Collection<Category>(this);

  @ManyToMany(() => Ingredient, (i) => i.products)
  ingredients = new Collection<Ingredient>(this);

  // @ManyToMany(() => Allergen)
  // allergens = new Collection<Allergen>(this);

  @OneToMany(() => ProductAvailability, (a) => a.product, {
    orphanRemoval: true,
  })
  availabilities = new Collection<ProductAvailability>(this);

  @OneToMany(() => ProductPrice, (p) => p.product, { orphanRemoval: true })
  prices = new Collection<ProductPrice>(this);

  @OneToMany(() => ProductCustomization, (c) => c.product, {
    orphanRemoval: true,
  })
  customizations = new Collection<ProductCustomization>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

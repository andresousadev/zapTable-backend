import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { Ingredient } from 'src/domain/catalog/entities/ingredient.entity';
import { Category } from './category.entity';
import { ProductCustomization } from './product-customization.entity';
import { ProductAvailability } from './product-availability.entity';
import { ProductPrice } from './product-price.entity';

@Entity()
export class Product {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  description: string;

  @Property()
  photoSrc: string;

  @Property()
  defaultPrice: number;

  @ManyToOne(() => Business)
  business: Business;

  @ManyToMany(() => Category, (c) => c.products)
  categories = new Collection<Category>(this);

  @ManyToMany(() => Ingredient, (i) => i.products, {
    owner: true,
    joinColumn: 'product_id',
    inverseJoinColumn: 'ingredient_id',
  })
  ingredients = new Collection<Ingredient>(this);

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

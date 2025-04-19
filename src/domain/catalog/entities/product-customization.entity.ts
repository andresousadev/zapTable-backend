import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Product } from './product.entity';
import { Ingredient } from './ingredient.entity';

@Entity()
export class ProductCustomization {
  @ManyToOne(() => Product, { primary: true })
  product: Product;

  @ManyToOne(() => Ingredient, { primary: true })
  ingredient: Ingredient;

  @Property()
  price: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

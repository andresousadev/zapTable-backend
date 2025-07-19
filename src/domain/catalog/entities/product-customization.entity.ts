import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Ingredient } from './ingredient.entity';
import { Product } from './product.entity';

@Entity()
@Unique({ properties: ['product', 'ingredient'] })
export class ProductCustomization {
  @ManyToOne(() => Product, { primary: true, deleteRule: 'cascade' })
  product!: Product;

  @ManyToOne(() => Ingredient, { primary: true, deleteRule: 'cascade' })
  ingredient!: Ingredient;

  @Property()
  price: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

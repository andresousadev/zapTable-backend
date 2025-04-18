import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { Ingredient } from 'src/domain/catalog/entities/ingredient.entity';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryKey()
  id: number;

  @Property()
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

  @ManyToMany({ entity: () => Ingredient, hidden: true })
  ingredients = new Collection<Ingredient>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

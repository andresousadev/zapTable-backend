import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { Product } from './product.entity';

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Ingredient {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  photoSrc: string;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business: Business;

  @ManyToMany(() => Product, (p) => p.ingredients)
  products = new Collection<Product>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

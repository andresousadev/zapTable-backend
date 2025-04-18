import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Menu } from './menu.entity';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ManyToMany(() => Menu, (m) => m.categories)
  menus = new Collection<Menu>(this);

  @ManyToMany(() => Product, (p) => p.categories)
  products = new Collection<Product>(this);
}

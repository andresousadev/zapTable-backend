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

  @ManyToMany(() => Product, (p) => p.categories, {
    owner: true,
    joinColumn: 'category_id',
    inverseJoinColumn: 'product_id',
  })
  products = new Collection<Product>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

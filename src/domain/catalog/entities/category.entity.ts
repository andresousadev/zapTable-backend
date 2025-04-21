import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Menu } from './menu.entity';
import { Product } from './product.entity';

@Entity()
@Unique({ properties: ['name', 'menu'] })
export class Category {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ManyToOne(() => Menu)
  menu: Menu;

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

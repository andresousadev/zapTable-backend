import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Product } from './product.entity';
import { Menu } from './menu.entity';

@Entity()
@Unique({ properties: ['product', 'menu'] })
export class ProductPrice {
  @ManyToOne(() => Product, { primary: true, deleteRule: 'cascade' })
  product: Product;

  @ManyToOne(() => Menu, { primary: true })
  menu: Menu;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

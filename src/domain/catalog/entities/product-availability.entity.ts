import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { Product } from './product.entity';

@Entity()
@Unique({ properties: ['restaurant', 'product'] })
export class ProductAvailability {
  @ManyToOne(() => Restaurant, { primary: true, deleteRule: 'cascade' })
  restaurant!: Restaurant;

  @ManyToOne(() => Product, { primary: true, deleteRule: 'cascade' })
  product!: Product;

  @Property()
  active: boolean = true;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

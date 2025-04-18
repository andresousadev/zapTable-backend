import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { Product } from './product.entity';

@Entity()
export class ProductAvailability {
  @ManyToOne(() => Restaurant, { primary: true })
  restaurant: Restaurant;

  @ManyToOne(() => Product, { primary: true })
  product: Product;

  @Property()
  active: boolean = true;
}

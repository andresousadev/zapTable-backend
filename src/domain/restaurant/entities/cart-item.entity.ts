import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { Cart } from './cart.entity';
import { Product } from '@app/domain/catalog/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => Cart, { deleteRule: 'cascade' })
  cart!: Cart;

  @ManyToOne(() => Product)
  product!: Rel<Product>;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  priceAddition!: number;

  @Property({ type: 'jsonb', nullable: true })
  customizations?: {
    ingredientId: string;
    ingredientName: string;
    extraPrice: number;
  }[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

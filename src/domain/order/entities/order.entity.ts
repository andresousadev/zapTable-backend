import { Cart } from '@app/domain/restaurant/entities/cart.entity';
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => Cart)
  cart!: Rel<Cart>;

  @OneToMany(() => OrderItem, (i) => i.order, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  items = new Collection<OrderItem>(this);

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Enum(() => OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

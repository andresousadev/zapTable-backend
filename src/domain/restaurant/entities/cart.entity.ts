import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { CartItem } from './cart-item.entity';
import { Order } from '@app/domain/order/entities/order.entity';
import { TableSession } from './table-session.entity';

@Entity()
export class Cart {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @OneToOne(() => TableSession, (s) => s.cart)
  tableSession!: Rel<TableSession>;

  @OneToMany(() => CartItem, (i) => i.cart, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  items = new Collection<CartItem>(this);

  @Property({ default: true })
  isOpen: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Order, (o) => o.cart)
  orders = new Collection<Order>(this);
}

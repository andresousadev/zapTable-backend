import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Table } from './table.entity';
import { Cart } from './cart.entity';
import { Order } from '@app/domain/order/entities/order.entity';

@Entity()
/**
 * TODO: Index to guarantee only one active session per table
 * CREATE UNIQUE INDEX unique_active_session_per_table
ON table_session (table_id)
WHERE is_active = true;
 */
export class TableSession {
  [OptionalProps]?:
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'orders'
    | 'cart'
    | 'endTime'
    | 'isActive'
    | 'startTime';

  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => Table)
  table!: Rel<Table>;

  @Property()
  startTime: Date = new Date();

  @Property()
  endTime?: Date;

  @Property({ default: true })
  isActive!: boolean;

  @OneToOne(() => Cart, (c) => c.tableSession, {
    owner: true,
    deleteRule: 'cascade',
  })
  cart!: Rel<Cart>;

  @OneToMany(() => Order, (o) => o.session, { deleteRule: 'cascade' })
  orders = new Collection<Order>(this);

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}

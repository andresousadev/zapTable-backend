import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Rel,
  Unique,
} from '@mikro-orm/core';
import { Restaurant } from './restaurant.entity';
import { TableSession } from './table-session.entity';

@Entity()
@Unique({ properties: ['tableNumber', 'restaurant', 'qrCode'] })
export class Table {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  tableNumber!: number;

  @Property()
  qrCode!: string;

  @Property({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Restaurant, { deleteRule: 'cascade' })
  restaurant!: Rel<Restaurant>;

  @OneToMany(() => TableSession, (s) => s.table)
  sessions = new Collection<TableSession>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

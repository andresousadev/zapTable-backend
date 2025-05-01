import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TableStatus } from '../enums/table-status.enum';
import { Restaurant } from './restaurant.entity';

@Entity()
@Unique({ properties: ['tableNumber', 'restaurant'] })
export class Table {
  @PrimaryKey()
  id: number;

  @Property()
  tableNumber: number;

  @Property()
  qrCode: string;

  @Property()
  active: boolean;

  @Enum(() => TableStatus)
  status: TableStatus;

  @ManyToOne(() => Restaurant, { deleteRule: 'cascade' })
  restaurant: Restaurant;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

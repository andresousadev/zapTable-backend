import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { TableStatus } from '../enums/table-status.enum';
import { Restaurant } from './restaurant.entity';

@Entity()
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

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
}

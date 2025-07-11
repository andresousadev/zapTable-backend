import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Table } from './table.entity';
import { TableSessionStatus } from '../enums/table-session-status.enum';
import { Cart } from './cart.entity';

@Entity()
export class TableSession {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => Table)
  table!: Rel<Table>;

  @Property()
  startTime: Date = new Date();

  @Property()
  endTime?: Date;

  @Enum(() => TableSessionStatus)
  status: TableSessionStatus = TableSessionStatus.ACTIVE;

  @OneToOne(() => Cart, (c) => c.tableSession, {
    owner: true,
    orphanRemoval: true,
    nullable: true,
  })
  cart?: Rel<Cart>;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}

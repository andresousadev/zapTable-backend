import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Table } from 'src/domain/restaurant/entities/table.entity';
import { Business } from './business.entity';
import { Staff } from 'src/domain/user/entities/staff.entity';

@Entity()
export class Restaurant {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  address: string;

  @Property()
  phoneNumber: string;

  @Property()
  photoSrc: string;

  @ManyToOne(() => Business)
  business: Business;

  @ManyToMany(() => Staff, (s) => s.restaurants)
  staff = new Collection<Staff>(this);

  @OneToMany(() => Table, (t) => t.restaurant, { orphanRemoval: true })
  tables = new Collection<Table>(this);
}

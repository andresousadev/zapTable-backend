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
import { StaffRole } from '@app/domain/user/entities/staff-role.entity';

@Entity()
export class Restaurant {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  address: string;

  @Property()
  phoneNumber: string;

  @Property()
  photoSrc: string;

  @ManyToOne(() => Business)
  business: Business;

  @ManyToMany(() => StaffRole, (s) => s.restaurants, {
    owner: true,
    joinColumn: 'restaurant_id',
    inverseJoinColumn: 'staff_id',
  })
  staff = new Collection<StaffRole>(this);

  @OneToMany(() => Table, (t) => t.restaurant, { orphanRemoval: true })
  tables = new Collection<Table>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

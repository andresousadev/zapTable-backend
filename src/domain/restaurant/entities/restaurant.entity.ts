import { StaffRole } from '@app/domain/user/entities/staff-role.entity';
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
import { Business } from '../../business/entities/business.entity';

@Entity()
export class Restaurant {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  // TODO Adicionar slug ao restaurant entity
  /*
  @Property({ unique: true })
  slug: string;
  */

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: true })
  phoneNumber?: string;

  @Property({ nullable: true })
  photoSrc?: string;

  // TODO: Ensure that only owners can create businesss
  @ManyToOne(() => Business, { deleteRule: 'cascade' })
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

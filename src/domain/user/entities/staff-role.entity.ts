import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { UserRole } from './user-role.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class StaffRole extends UserRole {
  constructor() {
    super();
    this.role = Role.STAFF;
  }

  @ManyToMany(() => Restaurant, (r) => r.staff, { deleteRule: 'cascade' })
  restaurants = new Collection<Restaurant>(this);
}

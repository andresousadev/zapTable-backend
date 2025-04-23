import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class Staff extends User {
  constructor() {
    super();
    this.role = UserRole.STAFF;
  }

  @ManyToMany(() => Restaurant, (r) => r.staff)
  restaurants = new Collection<Restaurant>(this);
}

import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';

@Entity()
export class Staff extends User {
  @ManyToMany(() => Restaurant, (r) => r.staff)
  restaurants = new Collection<Restaurant>(this);
}

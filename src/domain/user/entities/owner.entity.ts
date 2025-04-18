import { Collection, Entity, OneToMany } from '@mikro-orm/core';
import { User } from './user.entity';
import { Business } from 'src/domain/restaurant/entities/business.entity';

@Entity()
export class Owner extends User {
  @OneToMany(() => Business, (b) => b.owner, { orphanRemoval: true })
  businesses = new Collection<Business>(this);
}

import { Collection, Entity, OneToMany } from '@mikro-orm/core';
import { User } from './user.entity';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class Owner extends User {
  constructor() {
    super();
    this.role = UserRole.OWNER;
  }

  @OneToMany(() => Business, (b) => b.owner, { orphanRemoval: true })
  businesses = new Collection<Business>(this);
}

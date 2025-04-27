import { Collection, Entity, OneToMany } from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { UserRole } from './user-roles.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class OwnerRole extends UserRole {
  constructor() {
    super();
    this.role = Role.OWNER;
  }

  @OneToMany(() => Business, (b) => b.owner, { orphanRemoval: true })
  businesses = new Collection<Business>(this);
}

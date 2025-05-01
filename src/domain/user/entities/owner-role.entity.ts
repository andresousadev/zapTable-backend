import { Collection, Entity, OneToMany } from '@mikro-orm/core';
import { UserRole } from './user-role.entity';
import { Role } from '../enums/role.enum';
import { Business } from '@app/domain/restaurant/entities/business.entity';

@Entity()
export class OwnerRole extends UserRole {
  constructor() {
    super();
    this.role = Role.OWNER;
  }

  @OneToMany(() => Business, (b) => b.owner, { orphanRemoval: true })
  businesses = new Collection<Business>(this);
}

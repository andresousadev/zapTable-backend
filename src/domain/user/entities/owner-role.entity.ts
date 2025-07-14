import { Business } from '@app/domain/business/entities/business.entity';
import { Collection, Entity, OneToMany } from '@mikro-orm/core';
import { Role } from '../enums/role.enum';
import { UserRole } from './user-role.entity';

@Entity({ discriminatorValue: Role.OWNER })
export class OwnerRole extends UserRole {
  constructor() {
    super();
    this.role = Role.OWNER;
  }

  @OneToMany(() => Business, (b) => b.owner, { orphanRemoval: true })
  businesses = new Collection<Business>(this);
}

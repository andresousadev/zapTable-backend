import { Entity } from '@mikro-orm/core';
import { Role } from '../enums/role.enum';
import { UserRole } from './user-role.entity';

@Entity({ discriminatorValue: Role.ADMIN })
export class AdminRole extends UserRole {
  constructor() {
    super();
    this.role = Role.ADMIN;
  }
}

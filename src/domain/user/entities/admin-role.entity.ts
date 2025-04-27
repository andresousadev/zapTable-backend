import { Entity } from '@mikro-orm/core';
import { UserRole } from './user-roles.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class AdminRole extends UserRole {
  constructor() {
    super();
    this.role = Role.ADMIN;
  }
}

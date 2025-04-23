import { Entity, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class Admin extends User {
  constructor() {
    super();
    this.role = UserRole.ADMIN;
  }

  @ManyToOne(() => Business)
  business: Business;
}

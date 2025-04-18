import { Entity, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';
import { Business } from 'src/domain/restaurant/entities/business.entity';

@Entity()
export class Admin extends User {
  @ManyToOne(() => Business)
  business: Business;
}

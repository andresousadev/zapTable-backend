import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Role } from '../enums/role.enum';
import { User } from './user.entity';

@Entity({ discriminatorColumn: 'role' })
export abstract class UserRole {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Enum(() => Role)
  @Property({ nullable: false })
  role: Role;
}

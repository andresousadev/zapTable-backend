import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';

@Entity({ discriminatorColumn: 'role' })
export abstract class User {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Exclude()
  @Property()
  password: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

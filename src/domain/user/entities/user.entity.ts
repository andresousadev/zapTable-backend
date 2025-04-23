import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';

@Entity({ discriminatorColumn: 'role' })
export abstract class User {
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  name: string;

  @Property({ unique: true, nullable: false })
  email: string;

  @Property({ hidden: true, nullable: false })
  password: string;

  @Enum(() => UserRole)
  @Property({ nullable: false })
  role: UserRole;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

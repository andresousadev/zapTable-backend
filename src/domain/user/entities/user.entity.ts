import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  name: string;

  @Property({ unique: true, nullable: false })
  email: string;

  @Property({ hidden: true, nullable: false })
  password: string;

  // TODO migrate this to another table
  @Property({ nullable: true, hidden: true })
  refreshToken?: string;

  @OneToMany(() => UserRole, (u) => u.user)
  roles = new Collection<UserRole>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
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

  @OneToMany(() => 'OwnerRole', (o: UserRole) => o.user)
  ownerRoles = new Collection<UserRole>(this);

  @OneToMany(() => 'StaffRole', (s: UserRole) => s.user)
  staffRoles = new Collection<UserRole>(this);

  @OneToOne(() => 'AdminRole', (a: UserRole) => a.user)
  adminRole?: UserRole;

  @Property({ unique: true, nullable: false })
  email: string;

  @Property({ hidden: true, nullable: false })
  password: string;

  @OneToMany(() => UserRole, (u) => u.user)
  role = new Collection<UserRole>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

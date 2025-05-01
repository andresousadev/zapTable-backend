import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from './user-role.entity';
import { OwnerRole } from './owner-role.entity';
import { StaffRole } from './staff-role.entity';
import { AdminRole } from './admin-role.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ nullable: false })
  name: string;

  @OneToMany(() => OwnerRole, (o) => o.user)
  ownerRoles = new Collection<OwnerRole>(this);

  @OneToMany(() => StaffRole, (s) => s.user)
  staffRoles = new Collection<StaffRole>(this);

  @OneToOne(() => AdminRole, (a) => a.user)
  adminRole: AdminRole;

  @Property({ unique: true, nullable: false })
  email: string;

  @Property({ hidden: true, nullable: false })
  password: string;

  @OneToMany(() => UserRole, (u) => u.user)
  @Property({ nullable: false })
  role = new Collection<UserRole>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { Category } from './category.entity';

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Menu {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  photoSrc: string;

  @Property()
  active: boolean;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business: Business;

  @OneToMany(() => Category, (c) => c.menu)
  categories = new Collection<Category>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

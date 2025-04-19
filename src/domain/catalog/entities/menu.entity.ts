import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';
import { Category } from './category.entity';

@Entity()
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

  @ManyToOne(() => Business)
  business: Business;

  @ManyToMany(() => Category, (c) => c.menus, {
    owner: true,
    joinColumn: 'menu_id',
    inverseJoinColumn: 'category_id',
  })
  categories = new Collection<Category>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

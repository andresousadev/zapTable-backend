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

  @ManyToMany(() => Category, (c) => c.menus)
  categories = new Collection<Category>(this);
}

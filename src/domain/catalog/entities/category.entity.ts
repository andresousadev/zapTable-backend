import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Meal } from './meal.entity';
import { Menu } from './menu.entity';

@Entity()
@Unique({ properties: ['name', 'menu'] })
export class Category {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @ManyToOne(() => Menu, { deleteRule: 'cascade' })
  menu: Menu;

  @ManyToMany(() => Meal, (p) => p.categories, {
    owner: true,
    joinColumn: 'category_id',
    inverseJoinColumn: 'meal_id',
  })
  meals = new Collection<Meal>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

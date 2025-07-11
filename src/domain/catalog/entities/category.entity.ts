import { Business } from '@app/domain/business/entities/business.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Meal } from './meal.entity';
import { Menu } from './menu.entity';

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Category {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'meals' | 'menu';

  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  color?: string;

  @ManyToMany(() => Menu, (m) => m.categories)
  menus = new Collection<Menu>(this);

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business!: Business;

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

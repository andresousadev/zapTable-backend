import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Meal } from './meal.entity';
import { Menu } from './menu.entity';

@Entity()
@Unique({ properties: ['meal', 'menu'] })
export class MealPrice {
  @ManyToOne(() => Meal, { primary: true, deleteRule: 'cascade' })
  meal!: Meal;

  @ManyToOne(() => Menu, { primary: true })
  menu!: Menu;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

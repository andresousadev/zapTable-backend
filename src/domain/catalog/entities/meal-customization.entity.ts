import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Ingredient } from './ingredient.entity';
import { Meal } from './meal.entity';

@Entity()
@Unique({ properties: ['meal', 'ingredient'] })
export class MealCustomization {
  @ManyToOne(() => Meal, { primary: true, deleteRule: 'cascade' })
  meal: Meal;

  @ManyToOne(() => Ingredient, { primary: true, deleteRule: 'cascade' })
  ingredient: Ingredient;

  @Property()
  price: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

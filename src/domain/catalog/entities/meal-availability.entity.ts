import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { Meal } from './meal.entity';

@Entity()
@Unique({ properties: ['restaurant', 'meal'] })
export class MealAvailability {
  @ManyToOne(() => Restaurant, { primary: true, deleteRule: 'cascade' })
  restaurant: Restaurant;

  @ManyToOne(() => Meal, { primary: true, deleteRule: 'cascade' })
  meal: Meal;

  @Property()
  active: boolean = true;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

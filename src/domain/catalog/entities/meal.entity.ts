import { Business } from '@app/domain/business/entities/business.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Ingredient } from 'src/domain/catalog/entities/ingredient.entity';
import { Category } from './category.entity';
import { MealAvailability } from './meal-availability.entity';
import { MealCustomization } from './meal-customization.entity';
import { MealPrice } from './meal-price.entity';

@Entity()
export class Meal {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  description: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  defaultPrice: string;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business: Business;

  @ManyToMany(() => Category, (c) => c.meals)
  categories = new Collection<Category>(this);

  @ManyToMany(() => Ingredient, (i) => i.meals, {
    owner: true,
    joinColumn: 'meal_id',
    inverseJoinColumn: 'ingredient_id',
  })
  ingredients = new Collection<Ingredient>(this);

  @OneToMany(() => MealAvailability, (a) => a.meal, {
    orphanRemoval: true,
  })
  availabilities = new Collection<MealAvailability>(this);

  @OneToMany(() => MealPrice, (p) => p.meal, { orphanRemoval: true })
  prices = new Collection<MealPrice>(this);

  @OneToMany(() => MealCustomization, (c) => c.meal, {
    orphanRemoval: true,
  })
  customizations = new Collection<MealCustomization>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

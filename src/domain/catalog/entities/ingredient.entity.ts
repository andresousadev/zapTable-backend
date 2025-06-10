import { Business } from '@app/domain/business/entities/business.entity';
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

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Ingredient {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business: Business;

  @ManyToMany(() => Meal, (p) => p.ingredients)
  meals = new Collection<Meal>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

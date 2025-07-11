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

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Ingredient {
  // Necessary to create entity without having to provide every field defined here
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'meals';

  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business!: Business;

  @ManyToMany(() => Meal, (p) => p.ingredients)
  meals = new Collection<Meal>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

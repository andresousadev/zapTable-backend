import { Category } from '@app/domain/catalog/entities/category.entity';
import { Meal } from '@app/domain/catalog/entities/meal.entity';
import { OwnerRole } from '@app/domain/user/entities/owner-role.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Ingredient } from 'src/domain/catalog/entities/ingredient.entity';
import { Menu } from 'src/domain/catalog/entities/menu.entity';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';

@Entity()
export class Business {
  // Necessary to create entity without having to provide every field defined here
  [OptionalProps]?:
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'photoSrc'
    | 'owner'
    | 'restaurants'
    | 'categories'
    | 'meals'
    | 'menus'
    | 'ingredients';

  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @ManyToOne(() => OwnerRole)
  owner!: OwnerRole;

  @OneToMany(() => Restaurant, (r) => r.business)
  restaurants = new Collection<Restaurant>(this);

  @OneToMany(() => Category, (r) => r.business)
  categories = new Collection<Category>(this);

  @OneToMany(() => Meal, (p) => p.business)
  meals = new Collection<Meal>(this);

  @OneToMany(() => Menu, (m) => m.business)
  menus = new Collection<Menu>(this);

  @OneToMany(() => Ingredient, (i) => i.business)
  ingredients = new Collection<Ingredient>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

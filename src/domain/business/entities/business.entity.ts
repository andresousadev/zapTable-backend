import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Ingredient } from 'src/domain/catalog/entities/ingredient.entity';
import { Menu } from 'src/domain/catalog/entities/menu.entity';
import { Product } from 'src/domain/catalog/entities/product.entity';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { OwnerRole } from '@app/domain/user/entities/owner-role.entity';

@Entity()
export class Business {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  description: string;

  @Property()
  photoSrc: string;

  @ManyToOne(() => OwnerRole)
  owner: OwnerRole;

  @OneToMany(() => Restaurant, (r) => r.business)
  restaurants = new Collection<Restaurant>(this);

  @OneToMany(() => Product, (p) => p.business)
  products = new Collection<Product>(this);

  @OneToMany(() => Menu, (m) => m.business)
  menus = new Collection<Menu>(this);

  @OneToMany(() => Ingredient, (i) => i.business)
  ingredients = new Collection<Ingredient>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

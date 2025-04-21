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
import { Admin } from 'src/domain/user/entities/admin.entity';
import { Owner } from 'src/domain/user/entities/owner.entity';

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

  @ManyToOne(() => Owner)
  owner: Owner;

  @OneToMany(() => Admin, (a) => a.business, { orphanRemoval: true })
  admin = new Collection<Admin>(this);

  @OneToMany(() => Restaurant, (r) => r.business, { orphanRemoval: true })
  restaurants = new Collection<Restaurant>(this);

  @OneToMany(() => Product, (p) => p.business, { orphanRemoval: true })
  products = new Collection<Product>(this);

  @OneToMany(() => Menu, (m) => m.business, { orphanRemoval: true })
  menus = new Collection<Menu>(this);

  @OneToMany(() => Ingredient, (i) => i.business, { orphanRemoval: true })
  ingredients = new Collection<Ingredient>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

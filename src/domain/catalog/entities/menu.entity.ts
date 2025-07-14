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
import { Category } from './category.entity';

@Entity()
@Unique({ properties: ['name', 'business'] })
export class Menu {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'categories';

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  photoSrc?: string;

  @Property()
  active: boolean;

  @ManyToOne(() => Business, { deleteRule: 'cascade' })
  business: Business;

  @ManyToMany(() => Category, (c) => c.menus, {
    owner: true,
    joinColumn: 'menu_id',
    inverseJoinColumn: 'category_id',
  })
  categories = new Collection<Category>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

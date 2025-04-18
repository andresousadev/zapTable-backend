import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Business } from 'src/domain/restaurant/entities/business.entity';

@Entity()
export class Ingredient {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  photoSrc: string;

  @ManyToOne(() => Business)
  business: Business;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}

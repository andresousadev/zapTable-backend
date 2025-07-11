import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Meal } from '@app/domain/catalog/entities/meal.entity';

@Entity()
export class OrderItem {
  @PrimaryKey()
  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => Order)
  order!: Rel<Order>;

  @ManyToOne(() => Meal, { nullable: true })
  meal?: Rel<Meal>;

  @Property()
  mealId!: string;

  @Property()
  mealName!: string;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Property({ type: 'jsonb', nullable: true })
  customizations?: {
    ingredientId: string;
    ingredientName: string;
    extraPrice: number;
  }[];

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalItemPrice!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

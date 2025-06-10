import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,

    @InjectRepository(Meal)
    private readonly mealRepo: EntityRepository<Meal>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    const { mealIds: mealIds, ...properties } = createCategoryDto;

    wrap(category).assign(properties, { onlyProperties: true });

    if (mealIds?.length) {
      const meals = await this.mealRepo.find({ id: { $in: mealIds } });
      category.meals.set(meals);
    }

    await this.categoryRepo.getEntityManager().persistAndFlush(category);
  }

  async findAll() {
    return await this.categoryRepo.findAll();
  }

  async findOne(id: number) {
    return await this.categoryRepo.findOne(id);
  }

  async update(id: number, createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepo.findOneOrFail(id);

    const { mealIds: mealIds, ...properties } = createCategoryDto;

    if (mealIds?.length) {
      const meals = await this.mealRepo.find({
        id: { $in: mealIds },
      });
      category.meals.set(meals);
    }

    wrap(category).assign(properties, { onlyProperties: true });

    this.categoryRepo.merge(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOneOrFail(id);

    await this.categoryRepo.getEntityManager().removeAndFlush(category);
  }
}

import { Business } from '@app/domain/business/entities/business.entity';
import { BusinessNotFoundError } from '@app/domain/business/errors/business.error';
import { Utils } from '@app/shared/utils/utils.util';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateMealDto } from '../dto/inbound/create-meal.dto';
import { UpdateMealDto } from '../dto/inbound/update-meal.dto';
import { Meal } from '../entities/meal.entity';
import { MealNotFoundError } from '../errors/meal.error';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepo: EntityRepository<Meal>,
    private readonly em: EntityManager,
  ) {}
  async create(createmealDto: CreateMealDto) {
    const meal = new Meal();

    const { businessId, ...properties } = createmealDto;

    const filteredProperties = Utils.excludeUndefinedProperties(properties);

    wrap(meal).assign(filteredProperties, { onlyProperties: true });

    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    meal.business = business;

    await this.mealRepo.getEntityManager().persistAndFlush(meal);
  }

  async findAll() {
    return await this.mealRepo.findAll();
  }

  async findOne(id: number) {
    return await this.mealRepo.findOne(id);
  }

  async findByBusinessId(businessId: number) {
    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    return await this.mealRepo.find({ business });
  }

  async update(id: number, updatemealDto: UpdateMealDto) {
    const meal = this.getmealReference(id);

    wrap(meal).assign(updatemealDto, { onlyOwnProperties: true });

    await this.mealRepo.getEntityManager().persistAndFlush(meal);
  }

  async remove(id: number) {
    const meal = this.getmealReference(id);

    await this.mealRepo.getEntityManager().removeAndFlush(meal);
  }

  private getmealReference(id: number) {
    const meal = this.mealRepo.getReference(id);

    if (meal == null) throw new MealNotFoundError(id);

    return meal;
  }
}

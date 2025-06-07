import { Business } from '@app/domain/business/entities/business.entity';
import { BusinessNotFoundError } from '@app/domain/business/errors/business.error';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { Ingredient } from '../entities/ingredient.entity';
import { IngredientNotFoundError } from '../errors/ingredient.error';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: EntityRepository<Ingredient>,
    private readonly em: EntityManager,
  ) {}
  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = new Ingredient();

    const { businessId, ...properties } = createIngredientDto;

    wrap(ingredient).assign(properties, { onlyProperties: true });

    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    ingredient.business = business;

    await this.ingredientRepo.getEntityManager().persistAndFlush(ingredient);
  }

  async findAll() {
    await this.ingredientRepo.findAll();
  }

  async findOne(id: number) {
    return await this.ingredientRepo.findOne(id);
  }

  async findByBusinessId(businessId: number) {
    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    return await this.ingredientRepo.find({ business });
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = this.ingredientRepo.getReference(id);

    if (ingredient == null) throw new IngredientNotFoundError(id);

    wrap(ingredient).assign(updateIngredientDto, { onlyProperties: true });

    await this.ingredientRepo.getEntityManager().persistAndFlush(ingredient);
  }

  async remove(id: number) {
    const ingredient = this.ingredientRepo.getReference(id);

    if (ingredient == null) throw new IngredientNotFoundError(id);

    await this.ingredientRepo.getEntityManager().removeAndFlush(ingredient);
  }
}

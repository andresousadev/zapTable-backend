import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: EntityRepository<Ingredient>,
  ) {}
}

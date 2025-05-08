import { BaseException } from '@app/domain/errors/base.exception';

export class IngredientMustHaveNameError extends BaseException {
  constructor() {
    super('Ingredient must have a name', 500);
  }
}

export class IngredientNotFoundError extends BaseException {
  constructor(ingredientId: number) {
    super(`Ingredient with the id ${ingredientId} not found`, 404);
  }
}

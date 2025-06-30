import { BaseException } from '@app/domain/errors/base.exception';

export class MealNotFoundError extends BaseException {
  constructor(productId: number) {
    super(`Meal with the id ${productId} not found.`, 404);
  }
}

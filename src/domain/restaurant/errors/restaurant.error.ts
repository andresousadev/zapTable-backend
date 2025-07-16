import { BaseException } from '@app/domain/errors/base.exception';

export class RestaurantNotFoundError extends BaseException {
  constructor(restaurantId: string) {
    super(`Restaurant with the id ${restaurantId} not found`, 404);
  }
}

export class RestaurantWithoutNameError extends BaseException {
  constructor() {
    super('The restaurant should have a name', 500);
  }
}

export class RestaurantByBusinessIdError extends BaseException {
  constructor(businessId: string) {
    super(`Error fetching restaurants by the business id ${businessId}`, 500);
  }
}

import { DomainException } from '@app/shared/errors/domain-exception.base';

export class RestaurantNotFoundError extends DomainException {
  constructor() {
    super('Restaurant not found');
  }
}

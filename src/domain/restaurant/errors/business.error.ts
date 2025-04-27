import { DomainException } from '@app/shared/errors/domain-exception.base';

export class BusinessNotFoundError extends DomainException {
  constructor() {
    super('Business not found');
  }
}

import { DomainException } from '@app/shared/errors/domain-exception.base';

export class TableAlreadyExistsError extends DomainException {
  constructor() {
    super('There is already a table with that number');
  }
}

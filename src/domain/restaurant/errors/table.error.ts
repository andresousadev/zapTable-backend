import { BaseException } from '@app/domain/errors/base.exception';

export class TableAlreadyExistsError extends BaseException {
  constructor(tableNumber: number, restaurantId: number) {
    super(
      `There is already a table with the number ${tableNumber} in the restaurant with the id ${restaurantId}`,
      409,
    );
  }
}

export class TableNotFoundError extends BaseException {
  constructor(tableId: number) {
    super(`Table with the id ${tableId} was not found`, 404);
  }
}

import { BaseException } from '@app/domain/errors/base.exception';

export class ProductNotFoundError extends BaseException {
  constructor(productId: number) {
    super(`Product with the id ${productId} not found.`, 404);
  }
}

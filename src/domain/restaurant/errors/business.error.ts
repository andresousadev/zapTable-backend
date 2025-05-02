import { BaseException } from '@app/domain/errors/base.exception';

export class BusinessNotFoundError extends BaseException {
  constructor(businessId: number) {
    super(`Business with the id ${businessId} not found`, 404);
  }
}

export class BusinessAlreadyHasOwner extends BaseException {
  constructor(businessId: number) {
    super(
      `Business with the id ${businessId} already has an assigned owner`,
      409,
    );
  }
}

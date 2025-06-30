import { BaseException } from '@app/domain/errors/base.exception';

export class BusinessNotFoundError extends BaseException {
  constructor(businessId: number, error?: Error) {
    super(
      `Business with the id ${businessId} not found. ${error?.message}`,
      404,
    );
  }
}

export class BusinessAlreadyHasOwner extends BaseException {
  constructor(businessId: number, error?: Error) {
    super(
      `Business with the id ${businessId} already has an assigned owner. ${error?.message}`,
      409,
    );
  }
}

export class BusinessByUserIdError extends BaseException {
  constructor(userId: number, error?: Error) {
    super(
      `Error fetching businesses by the user id ${userId}. ${error?.message}`,
      500,
    );
  }
}

import { BaseException } from '@app/domain/errors/base.exception';

export class UserNotFoundByIdError extends BaseException {
  constructor(userId: number) {
    super(`User with id ${userId} was not found`, 404);
  }
}

export class UserNotFoundError extends BaseException {
  constructor() {
    super('User was not found', 404);
  }
}

import { BaseException } from '@app/domain/errors/base.exception';

export class AdminRoleAlreadyExists extends BaseException {
  constructor(userid: number) {
    super(`The user with the id ${userid} is already an admin`, 409);
  }
}

export class StaffRoleAlreadyExists extends BaseException {
  constructor(userid: number, restaurantId: number) {
    super(
      `The user with the id ${userid} is already a staff member of the restaurant with the id ${restaurantId}`,
      409,
    );
  }
}

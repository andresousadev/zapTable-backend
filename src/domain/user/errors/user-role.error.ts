import { DomainException } from '@app/shared/errors/domain-exception.base';

export class UserRoleAlreadyExists extends DomainException {
  constructor() {
    super('There is already an user with that role for that entity');
  }
}

export class AdminRoleAlreadyExists extends DomainException {
  constructor() {
    super('The user is already an admin');
  }
}

export class StaffRoleAlreadyExists extends DomainException {
  constructor() {
    super('The user is already a staff member of that restaurant');
  }
}

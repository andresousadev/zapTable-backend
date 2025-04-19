import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Admin } from '../entities/admin.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Staff } from '../entities/staff.entity';
import { Owner } from '../entities/owner.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepo: EntityRepository<Owner>,
    @InjectRepository(Admin)
    private readonly adminRepo: EntityRepository<Admin>,
    @InjectRepository(Staff)
    private readonly staffRepo: EntityRepository<Staff>,
  ) {}
}

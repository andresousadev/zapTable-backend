import { Business } from '@app/domain/business/entities/business.entity';
import { BusinessAlreadyHasOwner } from '@app/domain/business/errors/business.error';
import { Restaurant } from '@app/domain/restaurant/entities/restaurant.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { AdminRole } from '../entities/admin-role.entity';
import { OwnerRole } from '../entities/owner-role.entity';
import { StaffRole } from '../entities/staff-role.entity';
import { User } from '../entities/user.entity';
import {
  AdminRoleAlreadyExists,
  StaffRoleAlreadyExists,
} from '../errors/user-role.error';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(OwnerRole)
    private readonly ownerRoleRepo: EntityRepository<OwnerRole>,
    @InjectRepository(AdminRole)
    private readonly adminRoleRepo: EntityRepository<AdminRole>,
    @InjectRepository(StaffRole)
    private readonly staffRoleRepo: EntityRepository<StaffRole>,
  ) {}

  async createBusinessOwner(user: User, business: Business) {
    if (business.owner == null) {
      const ownerRole = new OwnerRole();

      ownerRole.user = user;
      ownerRole.businesses.add(business);

      await this.ownerRoleRepo.getEntityManager().persistAndFlush(ownerRole);
    } else {
      throw new BusinessAlreadyHasOwner(business.id);
    }
  }

  async createAdmin(user: User) {
    const adminRole = this.adminRoleRepo.findOne({ user });

    if (adminRole == null) {
      const adminRole = new AdminRole();

      adminRole.user = user;

      await this.ownerRoleRepo.getEntityManager().persistAndFlush(adminRole);
    } else {
      throw new AdminRoleAlreadyExists(user.id);
    }
  }

  async createStaff(user: User, restaurant: Restaurant) {
    if (await this.checkCanCreateStaff(user, restaurant)) {
      const staffRole = new StaffRole();

      staffRole.user = user;
      staffRole.restaurants.add(restaurant);

      await this.staffRoleRepo.getEntityManager().persistAndFlush(staffRole);
    } else {
      throw new StaffRoleAlreadyExists(user.id, restaurant.id);
    }
  }

  async checkCanCreateStaff(user: User, restaurant: Restaurant) {
    const staffRole = await this.staffRoleRepo.findOne({ user });

    return !staffRole || !(restaurant.id in staffRole.restaurants);
  }
}

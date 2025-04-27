import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { Business } from '@app/domain/restaurant/entities/business.entity';
import * as BusinessErrors from '@app/domain/restaurant/errors/business.error';
import * as UserRoleErrors from '../errors/user-role.error';
import { OwnerRole } from '../entities/owner-role.entity';
import { AdminRole } from '../entities/admin-role.entity';
import { StaffRole } from '../entities/staff-role.entity';
import { Restaurant } from '@app/domain/restaurant/entities/restaurant.entity';

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
    try {
      if (this.checkCanCreateBusinessOwner(business)) {
        const ownerRole = new OwnerRole();

        ownerRole.user = user;
        ownerRole.businesses.add(business);

        await this.ownerRoleRepo.getEntityManager().persistAndFlush(ownerRole);
      }
    } catch (err) {
      if (err instanceof BusinessErrors.BusinessNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async createAdmin(user: User) {
    if (await this.checkCanCreateAdmin(user)) {
      const adminRole = new AdminRole();

      adminRole.user = user;

      await this.ownerRoleRepo.getEntityManager().persistAndFlush(adminRole);
    } else {
      throw new UserRoleErrors.AdminRoleAlreadyExists();
    }
  }

  async createStaff(user: User, restaurant: Restaurant) {
    if (await this.checkCanCreateStaff(user, restaurant)) {
      const staffRole = new StaffRole();

      staffRole.user = user;
      staffRole.restaurants.add(restaurant);

      await this.staffRoleRepo.getEntityManager().persistAndFlush(staffRole);
    } else {
      throw new UserRoleErrors.StaffRoleAlreadyExists();
    }
  }

  checkCanCreateBusinessOwner(business: Business) {
    const ownerId = business.owner.id;

    if (ownerId != null) {
      const ownerRole = this.ownerRoleRepo.getReference(ownerId);

      if (ownerRole != null) return false;
    }

    return true;
  }

  async checkCanCreateAdmin(user: User) {
    const adminRole = await this.adminRoleRepo.findOne({ user });

    return adminRole == null;
  }

  async checkCanCreateStaff(user: User, restaurant: Restaurant) {
    const staffRole = await this.staffRoleRepo.findOne({ user });

    return !staffRole || !(restaurant.id in staffRole.restaurants);
  }
}

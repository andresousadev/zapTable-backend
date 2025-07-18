import { OwnerRole } from '@app/domain/user/entities/owner-role.entity';
import { StaffRole } from '@app/domain/user/entities/staff-role.entity';
import { User } from '@app/domain/user/entities/user.entity';
import { Role } from '@app/domain/user/enums/role.enum';
import { UserService } from '@app/domain/user/services/user.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class BusinessAccessGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as JwtPayload;

    const businessId = Number(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request?.params?.businessId as number) ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (request?.body?.businessId as number),
    );

    if (!businessId) {
      throw new ForbiddenException('Business ID required');
    }

    if (user.roles?.map((roleEntity) => roleEntity).includes(Role.ADMIN)) {
      return true;
    }

    const userWithRoles = await this.userService.findByEmailWithRoles(
      user.email,
    );

    if (!userWithRoles) {
      throw new ForbiddenException('User not found');
    }

    const hasAccess = this.checkBusinessAccess(userWithRoles, businessId);

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this business');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.userWithRoles = userWithRoles;
    return true;
  }

  private checkBusinessAccess(user: User, businessId: number): boolean {
    for (const roleEntity of user.roles.getItems()) {
      if (roleEntity instanceof OwnerRole) {
        const hasBusinessAccess = roleEntity.businesses
          .getItems()
          .some((business) => business.id === businessId);

        if (hasBusinessAccess) {
          return true;
        }
      }

      if (roleEntity instanceof StaffRole) {
        const hasRestaurantAccess = roleEntity.restaurants
          .getItems()
          .some((restaurant) => restaurant.id === businessId);
        if (hasRestaurantAccess) return true;
      }
    }

    return false;
  }
}

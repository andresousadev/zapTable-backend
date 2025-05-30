import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PasswordUtil } from '@app/shared/utils/password.util';
import { User } from '../entities/user.entity';
import { Business } from '@app/domain/restaurant/entities/business.entity';
import { UserRoleService } from './user-role.service';
import { Restaurant } from '@app/domain/restaurant/entities/restaurant.entity';
import { BusinessNotFoundError } from '@app/domain/restaurant/errors/business.error';
import { UserNotFoundByIdError, UserNotFoundError } from '../errors/user.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly userRoleService: UserRoleService,
    private readonly em: EntityManager,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = new User();

    await this.initializeUser(createUserDto, user);
    await this.userRepo.getEntityManager().persistAndFlush(user);
  }

  async makeOwner(userId: number, businessId: number) {
    const user = this.searchForUser(userId);
    const business = this.em.getReference(Business, businessId);

    if (business == null) {
      throw new BusinessNotFoundError(businessId);
    }

    await this.userRoleService.createBusinessOwner(user, business);
  }

  async makeAdmin(userId: number) {
    const user = this.searchForUser(userId);

    await this.userRoleService.createAdmin(user);
  }

  async makeStaff(userId: number, restaurantId: number) {
    const user = this.searchForUser(userId);
    const restaurant = this.em.getReference(Restaurant, restaurantId);

    await this.userRoleService.createStaff(user, restaurant);
  }

  async findAll() {
    return await this.userRepo.findAll();
  }

  async findOne(id: number) {
    return await this.userRepo.findOne(id);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.searchForUser(id);

    wrap(user).assign(updateUserDto, { onlyProperties: true });

    await this.userRepo.getEntityManager().flush();

    return user;
  }

  async remove(id: number) {
    const user = this.searchForUser(id);

    await this.userRepo.getEntityManager().removeAndFlush(user);
  }

  async initializeUser(
    createUserDto: CreateUserDto,
    user: User,
  ): Promise<User | null> {
    const { password, ...properties } = createUserDto;

    const existing = await this.findByEmail(properties.email);

    if (existing != null) {
      throw new UserNotFoundError();
    }

    wrap(user).assign(properties, { onlyProperties: true });

    user.password = await PasswordUtil.hash(password);

    return user;
  }

  searchForUser(userId: number) {
    const user = this.userRepo.getReference(userId);

    if (user == null) {
      throw new UserNotFoundByIdError(userId);
    }

    return user;
  }
}

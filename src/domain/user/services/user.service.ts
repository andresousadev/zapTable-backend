import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PasswordUtil } from '@app/shared/utils/password.util';
import { User } from '../entities/user.entity';
import { Business } from '@app/domain/restaurant/entities/business.entity';
import { UserRoleService } from './user-role.service';
import { Restaurant } from '@app/domain/restaurant/entities/restaurant.entity';

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
    const user = this.userRepo.getReference(userId);
    const business = this.em.getReference(Business, businessId);

    if (user != null && business != null) {
      await this.userRoleService.createBusinessOwner(user, business);
    } else {
      throw new NotFoundException();
    }
  }

  async makeAdmin(userId: number) {
    const user = this.userRepo.getReference(userId);

    if (user != null) {
      await this.userRoleService.createAdmin(user);
    } else {
      throw new NotFoundException();
    }
  }

  async makeStaff(userId: number, restaurantId: number) {
    const user = this.userRepo.getReference(userId);
    const restaurant = this.em.getReference(Restaurant, restaurantId);

    if (user != null) {
      await this.userRoleService.createStaff(user, restaurant);
    } else {
      throw new NotFoundException();
    }
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
    const user = await this.userRepo.findOneOrFail(id);

    wrap(user).assign(updateUserDto, { onlyProperties: true });

    await this.userRepo.getEntityManager().flush();

    return user;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneOrFail(id);

    await this.userRepo.getEntityManager().removeAndFlush(user);
  }

  async initializeUser(
    createUserDto: CreateUserDto,
    user: User,
  ): Promise<User | null> {
    const { password, ...properties } = createUserDto;

    const existing = await this.findByEmail(properties.email);

    if (existing != null) {
      throw new ConflictException('Email already being used');
    }

    wrap(user).assign(properties, { onlyProperties: true });

    user.password = await PasswordUtil.hash(password);

    return user;
  }
}

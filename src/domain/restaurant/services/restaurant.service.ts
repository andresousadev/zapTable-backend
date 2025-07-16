import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/domain/user/enums/role.enum';
import { BusinessService } from '@app/domain/business/services/business.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: EntityRepository<Restaurant>,
    private readonly businessService: BusinessService,
  ) {}

  @Roles(Role.ADMIN)
  async create(businessSlug: string, createRestaurantDto: CreateRestaurantDto) {
    const { name, slug } = createRestaurantDto;

    const business =
      await this.businessService.getBusinessEntityBySlug(businessSlug);

    const existingByName = await this.restaurantRepo.findOne({
      name: name,
      business: business.id,
    });

    if (existingByName) {
      throw new ConflictException(
        `Restaurant with name ${name} already exists withing business ${businessSlug}.`,
      );
    }

    const existingBySlug = await this.restaurantRepo.findOne({
      slug,
      business: business.id,
    });

    if (existingBySlug) {
      throw new ConflictException(
        `Restaurant with slug ${slug} already exists within ${businessSlug}`,
      );
    }

    try {
      const restaurant = this.restaurantRepo.create({
        ...createRestaurantDto,
        business: business,
      });

      await this.restaurantRepo.getEntityManager().persistAndFlush(restaurant);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to create restaurant due to an unexpected error.',
      );
    }
  }

  async findAllRestaurantsForBusiness(
    businessSlug: string,
    populateTables: boolean = false,
  ) {
    try {
      const business =
        await this.businessService.getBusinessEntityBySlug(businessSlug);

      const options = populateTables ? { populate: ['tables'] as const } : {};

      const restaurants = await this.restaurantRepo.find(
        {
          business: business.id,
        },
        {
          ...options,
          orderBy: { name: QueryOrder.ASC },
          populate: ['business'] as const,
        },
      );

      return restaurants;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to retrieve restaurants due to an unexpected error',
      );
    }
  }

  async findRestaurantByIdForBusiness(businessSlug: string, id: string) {
    const restaurant = await this.restaurantRepo.findOneOrFail(
      { id: id, business: { slug: businessSlug } },
      {
        populate: ['business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Restaurant with ID '${id}' not found for business '${businessSlug}'.`,
          ),
      },
    );
    return restaurant;
  }

  async findRestaurantBySlugForBusiness(
    businessSlug: string,
    restaurantSlug: string,
  ) {
    const restaurant = await this.restaurantRepo.findOneOrFail(
      { slug: restaurantSlug, business: { slug: businessSlug } },
      {
        populate: ['business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Restaurant with slug '${restaurantSlug}' not found for business '${businessSlug}'.`,
          ),
      },
    );
    return restaurant;
  }

  @Roles(Role.OWNER)
  async updateRestaurantForBusiness(
    businessSlug: string,
    restaurantSlug: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantRepo.findOneOrFail(
      { slug: restaurantSlug, business: { slug: businessSlug } },
      {
        populate: ['business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Restaurant with id '${restaurantSlug}' not found for business '${businessSlug}'.`,
          ),
      },
    );

    if (
      updateRestaurantDto.name &&
      updateRestaurantDto.name !== restaurant.name
    ) {
      const existingByName = await this.restaurantRepo.findOne({
        name: updateRestaurantDto.name,
        business: restaurant.business.id,
      });

      if (existingByName && existingByName.id !== restaurant.id) {
        throw new ConflictException(
          `Restaurant with name '${updateRestaurantDto.name}' already exists within business '${businessSlug}'.`,
        );
      }
    }

    if (
      updateRestaurantDto.slug &&
      updateRestaurantDto.slug !== restaurant.slug
    ) {
      const existingBySlug = await this.restaurantRepo.findOne({
        slug: updateRestaurantDto.slug,
        business: restaurant.business.id,
      });

      if (existingBySlug && existingBySlug.id !== restaurant.id) {
        throw new ConflictException(
          `Restaurant with slug '${updateRestaurantDto.slug}' already exists within business '${businessSlug}'.`,
        );
      }
    }

    try {
      Object.assign(restaurant, updateRestaurantDto);

      await this.restaurantRepo.getEntityManager().persistAndFlush(restaurant);

      return restaurant;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to update restaurant due to an unexpected error.',
      );
    }
  }

  @Roles(Role.OWNER)
  async deleteRestaurantForBusiness(
    businessSlug: string,
    restaurantSlug: string,
  ) {
    const restaurant = await this.restaurantRepo.findOneOrFail(
      { slug: restaurantSlug, business: { slug: businessSlug } },
      {
        failHandler: () =>
          new NotFoundException(
            `Restaurant with slug '${restaurantSlug}' not found for business '${businessSlug}'.`,
          ),
      },
    );
    try {
      await this.restaurantRepo.getEntityManager().removeAndFlush(restaurant);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete restaurant due to an unexpected error. It might have uncascaded associated entities or other database constraints.',
      );
    }
  }
}

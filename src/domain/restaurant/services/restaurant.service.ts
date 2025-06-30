import { Utils } from '@app/shared/utils/utils.util';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Business } from '../../business/entities/business.entity';
import { BusinessNotFoundError } from '../../business/errors/business.error';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import {
  RestaurantByBusinessIdError,
  RestaurantNotFoundError,
  RestaurantWithoutNameError,
} from '../errors/restaurant.error';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: EntityRepository<Restaurant>,
    private readonly em: EntityManager,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto) {
    const { name, businessId, ...properties } = createRestaurantDto;

    const business = this.em.getReference(Business, businessId);

    if (business == null) {
      throw new BusinessNotFoundError(businessId);
    }

    if (name == null) {
      throw new RestaurantWithoutNameError();
    }

    const restaurant = new Restaurant();

    const filteredProperties = Utils.excludeUndefinedProperties(properties);

    wrap(restaurant).assign(filteredProperties, { onlyProperties: true });

    restaurant.business = business;
    restaurant.name = name;

    await this.restaurantRepo.getEntityManager().persistAndFlush(restaurant);
  }

  async findAll() {
    return await this.restaurantRepo.findAll();
  }

  async findOne(id: number) {
    return await this.restaurantRepo.findOne(id);
  }

  async findByBusinessId(businessId: number) {
    try {
      const restaurants = await this.restaurantRepo.find({
        business: {
          id: businessId,
        },
      });

      return restaurants;
    } catch (error) {
      console.error('Error fetching restaurants by business ID', error);
      throw new RestaurantByBusinessIdError(businessId);
    }
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = this.restaurantRepo.getReference(id);

    if (restaurant == null) {
      throw new RestaurantNotFoundError(id);
    }

    wrap(restaurant).assign(updateRestaurantDto, { onlyProperties: true });

    await this.restaurantRepo.getEntityManager().persistAndFlush(restaurant);
  }

  async remove(id: number) {
    const restaurant = this.restaurantRepo.getReference(id);

    if (restaurant == null) {
      throw new RestaurantNotFoundError(id);
    }

    await this.restaurantRepo.getEntityManager().removeAndFlush(restaurant);
  }
}

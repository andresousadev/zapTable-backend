import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Restaurant } from '../entities/restaurant.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Business } from '../entities/business.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { BusinessNotFoundError } from '../errors/business.error';
import { RestaurantWithoutNameError } from '../errors/restaurant.error';
import { Utils } from '@app/shared/utils/utils.util';

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

  findAll() {
    return `This action returns all restaurant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}

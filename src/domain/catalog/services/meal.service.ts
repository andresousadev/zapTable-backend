import { Business } from '@app/domain/business/entities/business.entity';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMealDto } from '../dto/inbound/create-meal.dto';
import { UpdateMealDto } from '../dto/inbound/update-meal.dto';
import { Ingredient } from '../entities/ingredient.entity';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class MealService {
  private readonly logger = new Logger(MealService.name, { timestamp: true });

  constructor(
    @InjectRepository(Meal)
    private readonly mealRepo: EntityRepository<Meal>,
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: EntityRepository<Ingredient>,
    private readonly em: EntityManager,
  ) {}

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    this.logger.log(
      `operation='create', message='Creating meal', createMealDto='${JSON.stringify(createMealDto)}'`,
    );

    // Validate price
    if (Number(createMealDto.defaultPrice) <= 0) {
      throw new BadRequestException(
        `${createMealDto.defaultPrice} is an invalid value for a meal`,
      );
    }

    const { businessId, ingredientIds, ...basicProperties } = createMealDto;

    try {
      // Create the meal entity with basic properties
      const meal = this.mealRepo.create({
        ...basicProperties,
        business: this.businessRepo.getReference(businessId),
      });

      // Handle ingredients
      if (ingredientIds && ingredientIds.length > 0) {
        const ingredients = ingredientIds.map((id) =>
          this.ingredientRepo.getReference(id),
        );
        meal.ingredients.add(ingredients);
      }

      await this.em.persistAndFlush(meal);
      return meal;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Meal with name '${createMealDto.name}' already exists`,
        );
      }

      if (error instanceof ForeignKeyConstraintViolationException) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('business')) {
          throw new BadRequestException(
            `Business with id ${businessId} does not exist`,
          );
        }
        throw new BadRequestException('Invalid reference provided');
      }

      throw error;
    }
  }

  async findAll() {
    this.logger.log(
      `operation='findAll', message='Received request to fetch all meals'`,
    );

    return await this.mealRepo.findAll({
      populate: ['categories', 'ingredients'],
    });
  }

  async findOne(id: number): Promise<Meal> {
    this.logger.log(
      `operation='findOne', message='Received request to fetch meal by id', id='${id}'`,
    );

    const meal = await this.mealRepo.findOne(id, {
      populate: [
        'business',
        'categories',
        'ingredients',
        'availabilities',
        'prices',
        'customizations',
      ],
    });

    if (!meal) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }

    return meal;
  }

  async findByBusinessId(businessId: number): Promise<Meal[]> {
    this.logger.log(
      `operation='findByBusinessId', message='Received request to fetch meal by business id', businessId='${businessId}'`,
    );

    const business = this.businessRepo.getReference(businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id ${businessId} does not exist`,
      );
    }

    return await this.mealRepo.find(
      { business },
      {
        populate: ['categories', 'ingredients'],
      },
    );
  }

  async update(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    this.logger.log(
      `operation='update', message='Received request to update meal', updateMealDto='${JSON.stringify(updateMealDto)}'`,
    );

    const meal = await this.mealRepo.findOne(id, {
      populate: ['ingredients', 'availabilities', 'prices', 'customizations'],
    });

    if (!meal) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }

    if (updateMealDto.defaultPrice && Number(updateMealDto.defaultPrice) <= 0) {
      throw new BadRequestException(
        `${updateMealDto.defaultPrice} is an invalid value for a meal`,
      );
    }

    const { businessId, ingredientIds, ...basicProperties } = updateMealDto;

    try {
      // Update basic properties
      Object.assign(meal, basicProperties);

      // Handle business update
      if (businessId !== undefined) {
        meal.business = this.businessRepo.getReference(businessId);
      }

      // Handle ingredients update
      if (ingredientIds !== undefined) {
        meal.ingredients.removeAll();
        if (ingredientIds.length > 0) {
          const ingredients = ingredientIds.map((id) =>
            this.ingredientRepo.getReference(id),
          );
          meal.ingredients.add(ingredients);
        }
      }

      await this.em.flush();
      return meal;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Meal with name '${updateMealDto.name}' already exists`,
        );
      }

      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new BadRequestException('Invalid reference provided');
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(
      `operation='remove', message='Received request to delete meal', id='${id}'`,
    );

    const meal = await this.mealRepo.findOne(id);
    if (!meal) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }

    await this.em.removeAndFlush(meal);
  }
}

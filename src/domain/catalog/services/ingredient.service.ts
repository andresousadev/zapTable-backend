import { Business } from '@app/domain/business/entities/business.entity';
import {
  EntityRepository,
  ForeignKeyConstraintViolationException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateIngredientDto } from '../dto/inbound/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { Ingredient } from '../entities/ingredient.entity';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class IngredientService {
  private readonly logger = new Logger(IngredientService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: EntityRepository<Ingredient>,
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    @InjectRepository(Meal)
    private readonly mealRepo: EntityRepository<Meal>,
    private readonly em: EntityManager,
  ) {}
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    this.logger.log(
      `operation='create', message='Creating ingredient', createIngredientDto='${JSON.stringify(createIngredientDto)}'`,
    );

    const { businessId, mealIds, ...basicProperties } = createIngredientDto;

    try {
      const ingredient = this.ingredientRepo.create({
        ...basicProperties,
        business: this.businessRepo.getReference(businessId),
      });

      if (mealIds && mealIds.length > 0) {
        const meals = mealIds.map((id) => this.mealRepo.getReference(id));
        ingredient.meals.add(meals);
      }

      await this.em.persistAndFlush(ingredient);
      return ingredient;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Ingredient with name '${createIngredientDto.name}' already exists`,
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

      this.logger.error(
        `operation='create', message='Error while creating ingredient', createIngredientDto='${JSON.stringify(createIngredientDto)}'`,
        error,
      );
      throw error;
    }
  }

  async findAll(): Promise<Ingredient[]> {
    this.logger.log(
      `operation='findAll', message='Received request to fetch all ingredients'`,
    );

    return await this.ingredientRepo.findAll({
      populate: ['meals'],
    });
  }

  async findOne(id: number): Promise<Ingredient> {
    this.logger.log(
      `operation='findOne', message='Received request to fetch ingredient by id', id='${id}'`,
    );

    const ingredient = await this.ingredientRepo.findOne(id, {
      populate: ['meals'],
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }

    return ingredient;
  }

  async findByBusinessId(businessId: number): Promise<Ingredient[]> {
    this.logger.log(
      `operation='findByBusinessId', message='Received request to fetch ingredient by business id', businessId='${businessId}'`,
    );

    const business = this.em.getReference(Business, businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id ${businessId} does not exist`,
      );
    }

    return await this.ingredientRepo.find(
      { business },
      {
        populate: ['meals'],
      },
    );
  }

  async update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    this.logger.log(
      `operation='update', message='Received request to update ingredient', id='${id}', updateIngredientDto='${JSON.stringify(updateIngredientDto)}'`,
    );

    // find one function already verifies if exists or not, throwing if does not exist
    const ingredient = await this.findOne(id);

    const { businessId, mealIds, ...basicProperties } = updateIngredientDto;

    try {
      Object.assign(ingredient, basicProperties);

      if (businessId !== undefined) {
        ingredient.business = this.businessRepo.getReference(businessId);
      }

      if (mealIds && mealIds.length > 0) {
        ingredient.meals.removeAll();
        const meals = mealIds.map((id) => this.mealRepo.getReference(id));
        ingredient.meals.add(meals);
      }

      await this.em.persistAndFlush(ingredient);
      return ingredient;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Ingredient with name '${updateIngredientDto.name}' already exists`,
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

      this.logger.error(
        `operation='update', message='Error while updating ingredient', updateIngredientDto='${JSON.stringify(updateIngredientDto)}'`,
        error,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(
      `operation='remove', message='Received request to delete ingredient', id='${id}'`,
    );

    // TODO still need to add permissions, to not allow external business owners to delete
    const ingredient = await this.findOne(id);

    await this.em.removeAndFlush(ingredient);
  }
}

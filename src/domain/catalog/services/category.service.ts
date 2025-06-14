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
import { CreateCategoryDto } from '../dto/inbound/create-category.dto';
import { UpdateCategoryDto } from '../dto/inbound/update-category.dto';
import { Category } from '../entities/category.entity';
import { Meal } from '../entities/meal.entity';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    @InjectRepository(Meal)
    private readonly mealRepo: EntityRepository<Meal>,
    @InjectRepository(Menu)
    private readonly menuRepo: EntityRepository<Menu>,
    private readonly em: EntityManager,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(
      `operation='create', message='Creating category', createCategoryDto='${JSON.stringify(createCategoryDto)}'`,
    );

    const { businessId, mealIds, menuIds, ...properties } = createCategoryDto;

    try {
      const category = this.categoryRepo.create({
        ...properties,
        business: this.businessRepo.getReference(businessId),
      });

      if (mealIds && mealIds.length > 0) {
        const meals = mealIds.map((id) => this.mealRepo.getReference(id));
        category.meals.add(meals);
      }

      if (menuIds && menuIds.length > 0) {
        const menus = menuIds.map((id) => this.menuRepo.getReference(id));
        category.menus.add(menus);
      }

      await this.em.persistAndFlush(category);
      return category;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Category with name '${createCategoryDto.name}' already exists`,
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
        `operation='create', message='Error while creating category', createCategoryDto='${JSON.stringify(createCategoryDto)}`,
        error,
      );
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    this.logger.log(
      `operation='findAll', message='Received request to fetch all categories'`,
    );

    return await this.categoryRepo.findAll({
      populate: ['meals'],
    });
  }

  async findOne(id: number): Promise<Category> {
    this.logger.log(
      `operation='findOne', message='Received request to fetch category by id', id='${id}'`,
    );

    const category = await this.categoryRepo.findOne(id, {
      populate: ['meals'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async findByBusinessId(businessId: number): Promise<Category[]> {
    this.logger.log(
      `operation='findByBusinessId', message='Received request to fetch category by business id', businessId='${businessId}'`,
    );

    const business = this.em.getReference(Business, businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id ${businessId} does not exist`,
      );
    }

    return await this.categoryRepo.find(
      { business },
      {
        populate: ['meals'],
      },
    );
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `operation='update', message='Received request to update meal', id='${id}', updateCategoryDto='${JSON.stringify(updateCategoryDto)}'`,
    );

    // find one function already verifies if exists or not, throwing if does not exist
    const category = await this.findOne(id);

    const { businessId, mealIds, menuIds, ...basicProperties } =
      updateCategoryDto;

    try {
      Object.assign(category, basicProperties);

      if (businessId !== undefined) {
        category.business = this.businessRepo.getReference(businessId);
      }

      if (mealIds && mealIds.length > 0) {
        category.meals.removeAll();
        const meals = mealIds.map((id) => this.mealRepo.getReference(id));
        category.meals.add(meals);
      }

      if (menuIds && menuIds.length > 0) {
        category.menus.removeAll();
        const menus = menuIds.map((id) => this.menuRepo.getReference(id));
        category.menus.add(menus);
      }

      await this.em.persistAndFlush(category);
      return category;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Category with name '${updateCategoryDto.name}' already exists`,
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
        `operation='update', message='Error while updating Category', updateCategoryDto='${JSON.stringify(updateCategoryDto)}'`,
        error,
      );
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(
      `operation='remove', message='Received request to delete category', id='${id}'`,
    );

    const category = await this.findOne(id);

    await this.em.removeAndFlush(category);
  }
}

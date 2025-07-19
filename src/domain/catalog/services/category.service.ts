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
import { Menu } from '../entities/menu.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    @InjectRepository(Menu)
    private readonly menuRepo: EntityRepository<Menu>,
    private readonly em: EntityManager,
  ) {}

  async create(
    businessId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `operation='create', message='Creating category within business ${businessId}', createCategoryDto='${JSON.stringify(createCategoryDto)}'`,
    );

    const { productIds, menuIds, ...properties } = createCategoryDto;

    try {
      const category = this.categoryRepo.create({
        ...properties,
        business: businessId,
      });

      if (productIds && productIds.length > 0) {
        const products = productIds.map((id) =>
          this.productRepo.getReference(id),
        );
        category.products.add(products);
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

  async findAll(businessId: string): Promise<Category[]> {
    this.logger.log(
      `operation='findAll', message='Received request to fetch all categories within business ${businessId}'`,
    );

    return await this.categoryRepo.find(
      { business: businessId },
      {
        populate: ['products'],
      },
    );
  }

  async findOne(businessId: string, id: string): Promise<Category> {
    this.logger.log(
      `operation='findOne', message='Received request to fetch category by id within business ${businessId}', id='${id}'`,
    );

    const category = await this.categoryRepo.findOne(
      { id: id, business: businessId },
      {
        populate: ['products'],
      },
    );

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async findByIds(businessId: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const categories = await this.categoryRepo.find({
      id: { $in: ids },
      business: businessId,
    });

    if (categories.length !== ids.length) {
      const foundIds = new Set(categories.map((c) => c.id));
      const notFoundIds = ids.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `One or more categories not found within business '${businessId}': ${notFoundIds.join(', ')}`,
      );
    }

    return categories;
  }

  async update(
    businessId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `operation='update', message='Received request to update category within business ${businessId}', id='${id}', updateCategoryDto='${JSON.stringify(updateCategoryDto)}'`,
    );

    // find one function already verifies if exists or not, throwing if does not exist
    const category = await this.findOne(businessId, id);

    const { productIds, menuIds, ...basicProperties } = updateCategoryDto;

    try {
      Object.assign(category, basicProperties);

      if (productIds && productIds.length > 0) {
        category.products.removeAll();
        const products = productIds.map((id) =>
          this.productRepo.getReference(id),
        );
        category.products.add(products);
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

  async remove(businessId: string, id: string) {
    this.logger.log(
      `operation='remove', message='Received request to delete category within business ${businessId}', id='${id}'`,
    );

    const category = await this.findOne(businessId, id);

    await this.em.removeAndFlush(category);
  }
}

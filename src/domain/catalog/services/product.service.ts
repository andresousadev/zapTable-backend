import {
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
import { CreateProductDto } from '../dto/inbound/create-product.dto';
import { UpdateProductDto } from '../dto/inbound/update-product.dto';
import { Product } from '../entities/product.entity';
import Decimal from 'decimal.js';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name, {
    timestamp: true,
  });

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    businessId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    this.logger.log(
      `operation='create', message='Creating product within business ${businessId}', createProductDto='${JSON.stringify(createProductDto)}'`,
    );

    const { ingredientIds, categories, ...basicProperties } = createProductDto;

    try {
      // Create the product entity with basic properties
      const product = this.productRepo.create({
        ...basicProperties,
        business: businessId,
      });

      if (Array.isArray(categories) && categories.length > 0) {
        const foundCategories = await this.categoryService.findByIds(
          businessId,
          categories,
        );
        product.categories.set(foundCategories);
      }

      if (new Decimal(createProductDto.defaultPrice).lessThanOrEqualTo(0)) {
        // Validate price
        throw new BadRequestException(
          `${createProductDto.defaultPrice} is an invalid value for a product`,
        );
      }

      // Handle ingredients
      if (ingredientIds && ingredientIds.length > 0) {
        const ingredients = ingredientIds.map((id) =>
          this.ingredientRepo.getReference(id),
        );
        product.ingredients.add(ingredients);
      }

      await this.productRepo.getEntityManager().persistAndFlush(product);
      return product;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Product with name '${createProductDto.name}' already exists`,
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

  async findOneInBusiness(id: string, businessId: string): Promise<Product> {
    this.logger.log(
      `operation='findOneInBusiness', message='Received request to fetch product by id', id='${id}, businessId='${businessId}'`,
    );

    const product = await this.productRepo.findOne(
      { id, business: businessId },
      {
        populate: [
          'business',
          'categories',
          'ingredients',
          'availabilities',
          'prices',
          'customizations',
        ],
      },
    );

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} on business ${businessId} not found`,
      );
    }

    return product;
  }

  async findByBusinessId(businessId: string): Promise<Product[]> {
    this.logger.log(
      `operation='findByBusinessId', message='Received request to fetch product by business id', businessId='${businessId}'`,
    );

    const business = this.businessRepo.getReference(businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id ${businessId} does not exist`,
      );
    }

    return await this.productRepo.find(
      { business },
      {
        populate: ['categories', 'ingredients'],
      },
    );
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    this.logger.log(
      `operation='update', message='Received request to update product', updateProductDto='${JSON.stringify(updateProductDto)}'`,
    );

    const product = await this.productRepo.findOne(id, {
      populate: ['ingredients', 'availabilities', 'prices', 'customizations'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (
      updateProductDto.defaultPrice &&
      Number(updateProductDto.defaultPrice) <= 0
    ) {
      throw new BadRequestException(
        `${updateProductDto.defaultPrice} is an invalid value for a product`,
      );
    }

    const { businessId, ingredientIds, ...basicProperties } = updateProductDto;

    try {
      // Update basic properties
      Object.assign(product, basicProperties);

      // Handle business update
      if (businessId !== undefined) {
        product.business = this.businessRepo.getReference(businessId);
      }

      // Handle ingredients update
      if (ingredientIds !== undefined) {
        product.ingredients.removeAll();
        if (ingredientIds.length > 0) {
          const ingredients = ingredientIds.map((id) =>
            this.ingredientRepo.getReference(id),
          );
          product.ingredients.add(ingredients);
        }
      }

      await this.em.flush();
      return product;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `Product with name '${updateProductDto.name}' already exists`,
        );
      }

      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new BadRequestException('Invalid reference provided');
      }

      throw error;
    }
  }

  async removeInBusiness(id: string, businessId: string): Promise<void> {
    this.logger.log(
      `operation='removeInBusiness', message='Received request to delete product', id='${id}, businessId='${businessId}'`,
    );

    const product = await this.productRepo.findOne({
      id,
      business: businessId,
    });
    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} and businessId ${businessId} not found`,
      );
    }

    await this.em.removeAndFlush(product);
  }
}

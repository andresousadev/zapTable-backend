import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,

    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    const { productIds, ...properties } = createCategoryDto;

    wrap(category).assign(properties, { onlyProperties: true });

    if (productIds?.length) {
      const products = await this.productRepo.find({ id: { $in: productIds } });
      category.products.set(products);
    }

    await this.categoryRepo.getEntityManager().persistAndFlush(category);
  }

  async findAll() {
    return await this.categoryRepo.findAll();
  }

  async findOne(id: number) {
    return await this.categoryRepo.findOne(id);
  }

  async update(id: number, createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepo.findOneOrFail(id);

    const { productIds, ...properties } = createCategoryDto;

    if (productIds?.length) {
      const products = await this.productRepo.find({
        id: { $in: productIds },
      });
      category.products.set(products);
    }

    wrap(category).assign(properties, { onlyProperties: true });

    this.categoryRepo.merge(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOneOrFail(id);

    await this.categoryRepo.getEntityManager().removeAndFlush(category);
  }
}

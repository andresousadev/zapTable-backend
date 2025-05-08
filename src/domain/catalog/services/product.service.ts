import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Product } from '../entities/product.entity';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { Business } from '@app/domain/restaurant/entities/business.entity';
import { BusinessNotFoundError } from '@app/domain/restaurant/errors/business.error';
import { Utils } from '@app/shared/utils/utils.util';
import { ProductNotFoundError } from '../errors/product.error';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    private readonly em: EntityManager,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = new Product();

    const { businessId, ...properties } = createProductDto;

    const filteredProperties = Utils.excludeUndefinedProperties(properties);

    wrap(product).assign(filteredProperties, { onlyProperties: true });

    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    product.business = business;

    await this.productRepo.getEntityManager().persistAndFlush(product);
  }

  async findAll() {
    return await this.productRepo.findAll();
  }

  async findOne(id: number) {
    return await this.productRepo.findOne(id);
  }

  async findByBusinessId(businessId: number) {
    const business = this.em.getReference(Business, businessId);

    if (business == null) throw new BusinessNotFoundError(businessId);

    return await this.productRepo.find({ business });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.getProductReference(id);

    wrap(product).assign(updateProductDto, { onlyOwnProperties: true });

    await this.productRepo.getEntityManager().persistAndFlush(product);
  }

  async remove(id: number) {
    const product = this.getProductReference(id);

    await this.productRepo.getEntityManager().removeAndFlush(product);
  }

  private getProductReference(id: number) {
    const product = this.productRepo.getReference(id);

    if (product == null) throw new ProductNotFoundError(id);

    return product;
  }
}

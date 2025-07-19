import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: EntityRepository<Cart>,
  )
}

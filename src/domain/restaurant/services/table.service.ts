import { Injectable } from '@nestjs/common';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Table } from '../entities/table.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantNotFoundError } from '../errors/restaurant.error';
import { TableAlreadyExistsError } from '../errors/table.error';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepo: EntityRepository<Table>,
    private readonly em: EntityManager,
  ) {}
  async create(createTableDto: CreateTableDto) {
    const table = new Table();

    const { restaurantId, tableNumber, ...properties } = createTableDto;

    const restaurant = this.em.getReference(Restaurant, restaurantId);

    if (restaurant != null) {
      const existing = await this.tableRepo.findOne({
        restaurant,
        tableNumber,
      });

      if (existing != null) {
        throw new TableAlreadyExistsError();
      } else {
        wrap(table).assign(properties, { onlyProperties: true });

        table.restaurant = restaurant;
        table.tableNumber = tableNumber;

        await this.tableRepo.getEntityManager().persistAndFlush(table);
      }
    } else {
      throw new RestaurantNotFoundError();
    }
  }

  async findAll() {
    return await this.tableRepo.findAll();
  }

  async findOne(id: number) {
    return await this.tableRepo.findOne(id);
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const table = this.tableRepo.getReference(id);

    wrap(table).assign(updateTableDto, { onlyProperties: true });

    await this.tableRepo.getEntityManager().flush();

    return table;
  }

  async remove(id: number) {
    const table = this.tableRepo.getReference(id);

    if (table != null) {
      await this.tableRepo.getEntityManager().removeAndFlush(table);
    }
  }
}

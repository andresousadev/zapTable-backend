import { Injectable } from '@nestjs/common';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Table } from '../entities/table.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantNotFoundError } from '../errors/restaurant.error';
import {
  TableAlreadyExistsError,
  TableNotFoundError,
} from '../errors/table.error';
import { TableStatus } from '../enums/table-status.enum';

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

    if (restaurant == null) {
      throw new RestaurantNotFoundError(restaurantId);
    }

    const existingTable = this.tableRepo.find({
      restaurant: {
        id: restaurantId,
      },
      tableNumber: tableNumber,
    });

    if (existingTable != null) {
      throw new TableAlreadyExistsError(tableNumber, restaurantId);
    }

    wrap(table).assign(properties, { onlyProperties: true });

    table.restaurant = restaurant;
    table.tableNumber = tableNumber;

    await this.tableRepo.getEntityManager().persistAndFlush(table);
  }

  async findAll() {
    return await this.tableRepo.findAll();
  }

  async findOne(id: number) {
    return await this.tableRepo.findOne(id);
  }

  async findByRestaurantId(restaurantId: number) {
    const tables = await this.tableRepo.find({
      restaurant: {
        id: restaurantId,
      },
    });

    return tables;
  }

  async changeTableStatus(tableId: number, status: TableStatus) {
    const table = this.tableRepo.getReference(tableId);

    if (table == null) {
      throw new TableNotFoundError(tableId);
    }

    table.status = status;

    await this.tableRepo.getEntityManager().persistAndFlush(table);
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

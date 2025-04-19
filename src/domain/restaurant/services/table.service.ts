import { Injectable } from '@nestjs/common';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Table } from '../entities/table.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepo: EntityRepository<Table>,
  ) {}
  create(createTableDto: CreateTableDto) {
    return 'This action adds a new table';
  }

  findAll() {
    return `This action returns all table`;
  }

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}

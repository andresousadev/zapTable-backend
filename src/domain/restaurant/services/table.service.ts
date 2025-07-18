import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Table } from '../entities/table.entity';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepo: EntityRepository<Table>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createTable(
    businessSlug: string,
    restaurantSlug: string,
    createTableDto: CreateTableDto,
  ) {
    const { tableNumber, qrCode } = createTableDto;

    const restaurant =
      await this.restaurantService.findRestaurantBySlugForBusiness(
        businessSlug,
        restaurantSlug,
      );

    const existingTable = await this.tableRepo.findOne({
      restaurant: restaurant.id,
      tableNumber: tableNumber,
      qrCode: qrCode,
    });

    if (existingTable) {
      throw new ConflictException(
        `Table with number '${tableNumber}' and QR code '${qrCode}' 
        already exists for restaurant '${restaurantSlug}' within business '${businessSlug}'`,
      );
    }

    try {
      const table = this.tableRepo.create({
        ...createTableDto,
        restaurant: restaurant,
      });

      await this.tableRepo.getEntityManager().persistAndFlush(table);

      return table;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to create table due to an unexpected error.',
      );
    }
  }

  async findAllTablesForRestaurant(
    businessSlug: string,
    restaurantSlug: string,
  ) {
    try {
      const restaurant =
        await this.restaurantService.findRestaurantBySlugForBusiness(
          businessSlug,
          restaurantSlug,
        );

      const tables = await this.tableRepo.find(
        { restaurant: restaurant.id },
        {
          orderBy: { tableNumber: QueryOrder.ASC },
          populate: ['restaurant.business'] as const,
        },
      );

      return tables;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Failed to retrieve tables due to an unexpected error.`,
      );
    }
  }

  async findTableByNumberForRestaurant(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
  ) {
    const table = await this.tableRepo.findOneOrFail(
      {
        tableNumber: tableNumber,
        restaurant: {
          slug: restaurantSlug,
          business: { slug: businessSlug },
        },
      },
      {
        populate: ['restaurant.business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table ${tableNumber} not found in restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
          ),
      },
    );

    return table;
  }

  async findTableByCompositeKey(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    qrCode: string,
  ) {
    const table = await this.tableRepo.findOneOrFail(
      {
        tableNumber,
        qrCode,
        restaurant: { slug: restaurantSlug, business: { slug: businessSlug } },
      },
      {
        populate: ['restaurant.business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table with number '${tableNumber}' and QR code '${qrCode}' not found for restaurant 
            '${restaurantSlug}' within business '${businessSlug}'`,
          ),
      },
    );

    return table;
  }

  async findTableByIdForRestaurant(
    businessSlug: string,
    restaurantSlug: string,
    tableId: string,
  ) {
    const table = await this.tableRepo.findOneOrFail(
      {
        id: tableId,
        restaurant: { slug: restaurantSlug, business: { slug: businessSlug } },
      },
      {
        populate: ['restaurant.business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table with ID '${tableId}' not found for restaurant '${restaurantSlug}' within business '${businessSlug}'`,
          ),
      },
    );

    return table;
  }

  async updateTable(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    qrCode: string,
    updateTableDto: UpdateTableDto,
  ) {
    const table = await this.tableRepo.findOneOrFail(
      {
        tableNumber,
        qrCode,
        restaurant: { slug: restaurantSlug, business: { slug: businessSlug } },
      },
      {
        populate: ['restaurant.business'] as const,
        failHandler: () =>
          new NotFoundException(
            `table with number '${tableNumber}' and QR code '${qrCode}' 
            not found for restaurant '${restaurantSlug}' within business '${businessSlug}'`,
          ),
      },
    );

    // If tableNumber or qrCode are being updated, check for conflicts with the new values
    if (
      (updateTableDto.tableNumber !== undefined &&
        updateTableDto.tableNumber !== table.tableNumber) ||
      (updateTableDto.qrCode !== undefined &&
        updateTableDto.qrCode !== table.qrCode)
    ) {
      const newTableNumber = updateTableDto.tableNumber ?? table.tableNumber;
      const newQrCode = updateTableDto.qrCode ?? table.qrCode;

      const existingConflict = await this.tableRepo.findOne({
        restaurant: table.restaurant.id,
        tableNumber: newTableNumber,
        qrCode: newQrCode,
        id: { $ne: table.id }, // Exclude the current table from the search
      });

      if (existingConflict) {
        throw new ConflictException(
          `Another table with number '${newTableNumber}' and QR code '${newQrCode}' 
          already exists for restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
        );
      }
    }

    try {
      Object.assign(table, updateTableDto);

      await this.tableRepo.getEntityManager().persistAndFlush(table);

      return table;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to update table due to an unexpected error.',
      );
    }
  }

  async deleteTable(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    qrCode: string,
  ) {
    const table = await this.tableRepo.findOneOrFail(
      {
        tableNumber,
        qrCode,
        restaurant: { slug: restaurantSlug, business: { slug: businessSlug } },
      },
      {
        failHandler: () =>
          new NotFoundException(
            `Table with number '${tableNumber}' and QR code '${qrCode}' not found for restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
          ),
      },
    );

    try {
      await this.tableRepo.getEntityManager().removeAndFlush(table);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete table due to an unexpected error. It might have uncascaded associated entities or other database constraints.',
      );
    }
  }
}

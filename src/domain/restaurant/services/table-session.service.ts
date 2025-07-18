import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TableSession } from '../entities/table-session.entity';
import { EntityRepository, QueryOrder } from '@mikro-orm/postgresql';
import { TableService } from './table.service';
import { CreateTableSessionDto } from '../dto/create-table-session.dto';
import { UpdateTableSessionDto } from '../dto/update-table-session.dto';

@Injectable()
export class TableSessionService {
  constructor(
    @InjectRepository(TableSession)
    private readonly tableSessionRepo: EntityRepository<TableSession>,
    private readonly tableService: TableService,
    private readonly cartService: CartService,
  ) {}

  async createTableSession(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    qrCode: string,
    createTableSessionDto: CreateTableSessionDto,
  ) {
    const table = await this.tableService.findTableByCompositeKey(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
    );

    if (!table.isAvailable) {
      throw new ConflictException(
        `Table '${tableNumber}' (QR: '${qrCode}') is currently disabled and cannot start a new session.`,
      );
    }

    const existingActiveSession = await this.tableSessionRepo.findOne({
      table: table.id,
      isActive: true,
    });

    if (existingActiveSession) {
      throw new ConflictException(
        `Table '${tableNumber}' (QR: '${qrCode}') already has an active session.`,
      );
    }

    try {
      const tableSession = this.tableSessionRepo.create({
        ...createTableSessionDto,
        table: table,
      });

      const cart = this.cartService.createCartForSession(tableSession);

      tableSession.cart = cart;

      await this.tableSessionRepo
        .getEntityManager()
        .persistAndFlush(tableSession);

      return tableSession;
    } catch (error: any) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.code === '23505' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        error.detail.includes('table_session_active_unique')
      ) {
        throw new ConflictException(
          `Table ${tableNumber} (QR: ${qrCode}) already has an active session.`,
        );
      }

      throw new InternalServerErrorException(
        error,
        'Failed to create table session due to an unexpected error.',
      );
    }
  }

  async findAllTableSessionsForTable(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
  ) {
    try {
      const table = await this.tableService.findTableByNumberForRestaurant(
        businessSlug,
        restaurantSlug,
        tableNumber,
      );

      const sessions = await this.tableSessionRepo.find(
        { table: table.id },
        {
          orderBy: { startTime: QueryOrder.DESC },
          populate: ['table.restaurant.business'] as const,
        },
      );

      return sessions;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to retrieve table sessions due to an unexpected error.',
      );
    }
  }

  async findTableSessionById(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    sessionId: string,
  ) {
    const session = await this.tableSessionRepo.findOneOrFail(
      {
        id: sessionId,
        table: {
          tableNumber,
          restaurant: {
            slug: restaurantSlug,
            business: { slug: businessSlug },
          },
        },
      },
      {
        populate: ['table.restaurant.business'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table session with ID '${sessionId}' not found for table ${tableNumber} ` +
              `in restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
          ),
      },
    );

    return session;
  }

  async updateTableSession(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    sessionId: string,
    updateTableSessionDto: UpdateTableSessionDto,
  ) {
    const { isActive, endTime } = updateTableSessionDto;

    const session = await this.tableSessionRepo.findOneOrFail(
      {
        id: sessionId,
        table: {
          tableNumber,
          restaurant: {
            slug: restaurantSlug,
            business: { slug: businessSlug },
          },
        },
      },
      {
        populate: ['table'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table session with ID '${sessionId}' not found for table ${tableNumber} ` +
              `in restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
          ),
      },
    );

    if (session.isActive && (isActive === false || endTime)) {
      session.endTime = endTime || new Date();
      session.isActive = false;
    } else if (session.isActive === false && isActive === true) {
      throw new BadRequestException(
        `Cannot reactivate session ${sessionId}. Start a new one.`,
      );
    }

    try {
      Object.assign(session, updateTableSessionDto);

      await this.tableSessionRepo.getEntityManager().persistAndFlush(session);

      return session;
    } catch (error: any) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.code === '23505' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        error.detail.includes('table_session_active_unique')
      ) {
        throw new ConflictException(
          `Table ${tableNumber} already has an active session.`,
        );
      }

      throw new InternalServerErrorException(
        error,
        'Failed to update table session due to an unexpected error.',
      );
    }
  }

  async deleteTableSession(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    sessionId: string,
  ) {
    const session = await this.tableSessionRepo.findOneOrFail(
      {
        id: sessionId,
        table: {
          tableNumber,
          restaurant: {
            slug: restaurantSlug,
            business: { slug: businessSlug },
          },
        },
      },
      {
        populate: ['table'] as const,
        failHandler: () =>
          new NotFoundException(
            `Table session with ID '${sessionId}' not found for table ${tableNumber} ` +
              `in restaurant '${restaurantSlug}' within business '${businessSlug}'.`,
          ),
      },
    );

    try {
      await this.tableSessionRepo.getEntityManager().removeAndFlush(session);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete table session due to an unexpected error.',
      );
    }
  }

  async findActiveSessionForTableForClient(
    businessSlug: string,
    restaurantSlug: string,
    tableNumber: number,
    qrCode: string,
  ) {
    const table = await this.tableService.findTableByCompositeKey(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
    );

    if (!table.isAvailable) {
      throw new BadRequestException(
        `Table ${tableNumber} (QR: ${qrCode}) is currently disabled by staff.`,
      );
    }

    const session = await this.tableSessionRepo.findOne(
      {
        table: table.id,
        isActive: true,
      },
      { populate: ['table.restaurant.business', 'cart'] as const },
    );

    if (!session) {
      throw new NotFoundException(
        `No active session found for table ${tableNumber} (QR: ${qrCode}). You may need to start a new one.`,
      );
    }

    return session;
  }
}

import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TableSession } from '../entities/table-session.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TableService } from './table.service';
import { CreateTableSessionDto } from '../dto/create-table-session.dto';

@Injectable()
export class TableSessionService {
  constructor(
    @InjectRepository(TableSession)
    private readonly tableSessionRepo: EntityRepository<TableSession>,
    private readonly tableService: TableService,
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
}

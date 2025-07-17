import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { TableSessionService } from '../services/table-session.service';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/domain/user/enums/role.enum';
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TableSession } from '../entities/table-session.entity';
import { CreateTableSessionDto } from '../dto/create-table-session.dto';

@Controller(
  'business/:businessSlug/restaurant/:restaurantSlug/table/:tableNumber/:qrCode/session/',
)
export class TableSessionController {
  constructor(private readonly tableSessionService: TableSessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start a new table session for a specific table' })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'tableNumber',
    description: 'Number of the table',
    type: Number,
  })
  @ApiParam({
    name: 'qrCode',
    description: 'QR code of the table',
    type: String,
  })
  @ApiBody({
    type: CreateTableSessionDto,
    required: false,
    description: 'Optional: Initial status if not "active"',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The table session has been successfully started.',
    type: TableSession,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Table is already occupied or has an active session.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async createTableSession(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableId') tableId: string,
  ) {
    return await this.tableSessionService.startTableSession(
      restaurantSlug,
      tableId,
    );
  }

  @Get('tables/:tableId/session/active')
  async getActiveTableSession(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableId') tableId: string,
  ) {
    return await this.tableSessionService.getActiveTableSession(
      restaurantSlug,
      tableId,
    );
  }

  @Roles(Role.STAFF, Role.ADMIN)
  @Get('session/:sessionId')
  async getTableSessionById(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('sessionId') sessionId: string,
  ) {
    return await this.tableSessionService.getTableSessionById(
      restaurantSlug,
      sessionId,
    );
  }

  @Post('sessions/:sessionId/end')
  @Roles(Role.STAFF)
  async endTableSession(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('sessionId') sessionId: string,
  ) {
    return await this.tableSessionService.endTableSession(
      restaurantSlug,
      sessionId,
    );
  }
}

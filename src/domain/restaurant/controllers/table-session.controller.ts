import { Controller, Get, Param, Post } from '@nestjs/common';
import { TableSessionService } from '../services/table-session.service';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/domain/user/enums/role.enum';

@Controller('restaurant/:restaurantSlug')
export class TableSessionController {
  constructor(private readonly tableSessionService: TableSessionService) {}

  @Post('tables/:tableId/session/start')
  async startTableSession(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableId') tableId: string,
  ) {
    return await this.tableSessionService.startTableSession(restaurantSlug, tableId);
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
    return await this.tableSessionService.endTableSession(restaurantSlug, sessionId);
  }
}

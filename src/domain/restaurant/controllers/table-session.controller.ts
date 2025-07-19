import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TableSessionService } from '../services/table-session.service';
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TableSession } from '../entities/table-session.entity';
import { CreateTableSessionDto } from '../dto/create-table-session.dto';
import { UpdateTableSessionDto } from '../dto/update-table-session.dto';

@Controller(
  'business/:businessSlug/restaurant/:restaurantSlug/table/:tableNumber/session/',
)
export class TableSessionController {
  constructor(private readonly tableSessionService: TableSessionService) {}

  @Post('client/:qrCode/start')
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
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('qrCode') qrCode: string,
    @Body() createTableSessionDto: CreateTableSessionDto,
  ) {
    return await this.tableSessionService.createTableSession(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
      createTableSessionDto,
    );
  }

  @Get('client/:qrCode/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'CLIENT: Get the currently active session for a table via QR code.',
  })
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
    description: 'QR code of the table (scanned by client)',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active table session found.',
    type: TableSession,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'No active session found, or Table/Restaurant/Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Table is currently disabled by staff.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getActiveSessionClient(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('qrCode') qrCode: string,
  ) {
    return this.tableSessionService.findActiveSessionForTableForClient(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all table sessions for a specific table' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of table sessions for the specified table.',
    type: [TableSession],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAllTableSessions(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber') tableNumber: number,
  ) {
    return await this.tableSessionService.findAllTableSessionsForTable(
      businessSlug,
      restaurantSlug,
      tableNumber,
    );
  }

  @Get(':sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a single table session by ID for a specific table',
  })
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
    name: 'sessionId',
    description: 'UUID ID of the table session to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Table session found.',
    type: TableSession,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table Session, Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findTableSessionById(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber') tableNumber: number,
    @Param('sessionId') sessionId: string,
  ) {
    return await this.tableSessionService.findTableSessionById(
      businessSlug,
      restaurantSlug,
      tableNumber,
      sessionId,
    );
  }

  @Put(':sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'STAFF: Update a table session (e.g., end it) for a specific table',
  })
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
    name: 'sessionId',
    description: 'UUID ID of the table session to update',
    type: String,
  })
  @ApiBody({
    type: UpdateTableSessionDto,
    description:
      'Update session details. Set isActive to false or provide endTime to end the session.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The table session has been successfully updated.',
    type: TableSession,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table Session, Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Attempted to reactivate a session or create a conflict with another active session.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid request data (e.g., trying to reactivate an ended session).',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async updateTableSession(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('sessionId') sessionId: string,
    @Body() updateTableSessionDto: UpdateTableSessionDto,
  ) {
    return this.tableSessionService.updateTableSession(
      businessSlug,
      restaurantSlug,
      tableNumber,
      sessionId,
      updateTableSessionDto,
    );
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'STAFF: Delete a table session for a specific table',
  })
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
    name: 'sessionId',
    description: 'UUID ID of the table session to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The table session has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table Session, Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async deleteTableSession(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('sessionId') sessionId: string,
  ) {
    await this.tableSessionService.deleteTableSession(
      businessSlug,
      restaurantSlug,
      tableNumber,
      sessionId,
    );
  }
}

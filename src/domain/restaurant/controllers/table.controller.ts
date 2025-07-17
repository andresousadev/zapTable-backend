import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TableService } from '../services/table.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Table } from '../entities/table.entity';

@Controller('business/:businessSlug/restaurant/:restaurantSlug/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new table for a specific restaurant' })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant owning the table',
    type: String,
  })
  @ApiBody({ type: CreateTableDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The table has been successfully created.',
    type: Table,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Table with this number and QR code already exists within the restaurant.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business or Restaurant not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async createTable(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Body() createTableDto: CreateTableDto,
  ) {
    return this.tableService.createTable(
      businessSlug,
      restaurantSlug,
      createTableDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all tables for a specific restaurant' })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant to retrieve tables for',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tables for the specified restaurant.',
    type: [Table],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business or Restaurant not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAllTables(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
  ) {
    return this.tableService.findAllTablesForRestaurant(
      businessSlug,
      restaurantSlug,
    );
  }

  @Get(':tableNumber/:qrCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Retrieve a single table by its number and QR code for a specific restaurant',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant owning the table',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Table found.',
    type: Table,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findTableByCompositeKey(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('qrCode') qrCode: string,
  ) {
    return this.tableService.findTableByCompositeKey(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
    );
  }

  @Get('id/:tableId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a single table by its ID for a specific restaurant',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant owning the table',
    type: String,
  })
  @ApiParam({
    name: 'tableId',
    description: 'UUID ID of the table to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Table found.',
    type: Table,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findTableById(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableId', ParseUUIDPipe) tableId: string,
  ) {
    return this.tableService.findTableByIdForRestaurant(
      businessSlug,
      restaurantSlug,
      tableId,
    );
  }

  @Put(':tableNumber/:qrCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Update a table by its number and QR code for a specific restaurant',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant owning the table',
    type: String,
  })
  @ApiParam({
    name: 'tableNumber',
    description: 'Number of the table to update',
    type: Number,
  })
  @ApiParam({
    name: 'qrCode',
    description: 'QR code of the table to update',
    type: String,
  })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The table has been successfully updated.',
    type: Table,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Updated table number and QR code already exist for another table within the restaurant.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async updateTable(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('qrCode') qrCode: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
      updateTableDto,
    );
  }

  @Delete(':tableNumber/:qrCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Delete a table by its number and QR code for a specific restaurant',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant owning the table',
    type: String,
  })
  @ApiParam({
    name: 'tableNumber',
    description: 'Number of the table to delete',
    type: Number,
  })
  @ApiParam({
    name: 'qrCode',
    description: 'QR code of the table to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The table has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Table, Restaurant, or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async deleteTable(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Param('qrCode') qrCode: string,
  ): Promise<void> {
    await this.tableService.deleteTable(
      businessSlug,
      restaurantSlug,
      tableNumber,
      qrCode,
    );
  }
}

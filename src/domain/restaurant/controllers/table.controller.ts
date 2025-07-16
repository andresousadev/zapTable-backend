import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TableService } from '../services/table.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/domain/user/enums/role.enum';

@Controller('restaurant/:restaurantSlug/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Param('restaurantSlug') restaurantSlug: string,
    @Body() createTableDto: CreateTableDto,
  ) {
    return await this.tableService.createTableForRestaurant(
      restaurantSlug,
      createTableDto,
    );
  }

  @Get()
  @Roles(Role.OWNER, Role.STAFF)
  async findAll(@Param('restaurantSlug') restaurantSlug: string) {
    return await this.tableService.findAllTablesByRestaurantSlug(restaurantSlug);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.STAFF)
  async findOneById(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.tableService.findTableByIdAndRestaurantSlug(restaurantSlug, id);
  }

  @Get('by-number/:tableNumber')
  @Roles(Role.OWNER, Role.STAFF)
  async findOneByNumber(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
  ) {
    return await this.tableService.findTableByNumberAndRestaurantSlug(
      restaurantSlug,
      tableNumber,
    );
  }

  @Roles(Role.OWNER, Role.STAFF)
  @Patch(':id')
  async update(
    @Param('restaurantSlug') restaurantSlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return await this.tableService.update(id, updateTableDto);
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tableService.remove(id);
  }
}

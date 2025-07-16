import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { Role } from '@app/domain/user/enums/role.enum';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

@Controller('business/:businessSlug/restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new restaurant for a specific business' })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The restaurant has been successfully created.',
    type: Restaurant,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Restaurant with this name or slug already exists within the business.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async create(
    @Param('businessSlug') businessSlug: string,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return await this.restaurantService.create(
      businessSlug,
      createRestaurantDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all restaurants for a specific business' })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business to retrieve restaurants for',
    type: String,
  })
  @ApiQuery({
    name: 'populateTables',
    required: false,
    type: Boolean,
    description: 'Whether to populate associated tables',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of restaurants for the specified business.',
    type: [Restaurant],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAllRestaurants() {
    return await this.restaurantService.findAllRestaurantsForBusiness();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.restaurantService.findOne(id);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.restaurantService.findBySlug(slug);
  }

  @Get(':businessId')
  async findByBusinessId(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ) {
    return await this.restaurantService.findByBusinessId(businessId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.restaurantService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  Put,
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
  async findAllRestaurantsForBusiness(
    @Param('businessSlug') businessSlug: string,
    @Query('populateTables') populateTables?: string,
  ) {
    const shouldPopulateTables = populateTables === 'true';
    return await this.restaurantService.findAllRestaurantsForBusiness(
      businessSlug,
      shouldPopulateTables,
    );
  }

  @Get(':restaurantSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a single restaurant by slug for a specific business',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant found.',
    type: Restaurant,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Get(':slug')
  async findRestaurantBySlug(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
  ) {
    return await this.restaurantService.findRestaurantBySlugForBusiness(
      businessSlug,
      restaurantSlug,
    );
  }

  @Get('id/:restaurantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a single restaurant by ID for a specific business',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'UUID of the restaurant to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant found.',
    type: Restaurant,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Get(':id')
  async findRestaurantById(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return await this.restaurantService.findRestaurantByIdForBusiness(
      businessSlug,
      restaurantId,
    );
  }

  @Put(':restaurantSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a restaurant by slug for a specific business',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant to update',
    type: String,
  })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The restaurant has been successfully updated.',
    type: Restaurant,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Updated name or slug already exists within the business.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async updateRestaurant(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.updateRestaurantForBusiness(
      businessSlug,
      restaurantSlug,
      updateRestaurantDto,
    );
  }

  @Delete(':restaurantSlug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a restaurant by slug for a specific business',
  })
  @ApiParam({
    name: 'businessSlug',
    description: 'Slug of the business owning the restaurant',
    type: String,
  })
  @ApiParam({
    name: 'restaurantSlug',
    description: 'Slug of the restaurant to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The restaurant has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant or Business not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async deleteRestaurant(
    @Param('businessSlug') businessSlug: string,
    @Param('restaurantSlug') restaurantSlug: string,
  ) {
    await this.restaurantService.deleteRestaurantForBusiness(
      businessSlug,
      restaurantSlug,
    );
  }
}

import { Roles } from '@app/auth/decorators/roles.decorator';
import { BusinessAccessGuard } from '@app/auth/guards/business-access.guard';
import { Role } from '@app/domain/user/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMealDto } from '../dto/inbound/create-meal.dto';
import { UpdateMealDto } from '../dto/inbound/update-meal.dto';
import { MealService } from '../services/meal.service';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @Roles(Role.OWNER)
  @UseGuards(BusinessAccessGuard)
  create(@Body() createMealDto: CreateMealDto) {
    return this.mealService.create(createMealDto);
  }

  @Get('/business/:businessId/:id')
  @ApiOperation({ summary: 'Meal for a specific business' })
  @ApiResponse({
    status: 200,
    description: 'Search meal by Id for a spefic business',
  })
  findOne(
    @Param('businessId', ParseIntPipe)
    businessId: number,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.mealService.findOneInBusiness(+id, businessId);
  }

  @Get('/business/:businessId')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'All Meals for a specific business' })
  @ApiResponse({
    status: 200,
    description: 'Allows user to query all meals from a spefic business',
  })
  findByBusiness(@Param('businessId', ParseIntPipe) id: number) {
    return this.mealService.findByBusinessId(id);
  }

  @Patch(':id')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'Update meal information on a given business' })
  @ApiResponse({
    status: 200,
    description: 'Update meal information',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatemealDto: UpdateMealDto,
  ) {
    return this.mealService.update(id, updatemealDto);
  }

  @Delete(':id')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER)
  remove(
    @Param('businessId', ParseIntPipe)
    businessId: number,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.mealService.removeInBusiness(id, businessId);
  }
}

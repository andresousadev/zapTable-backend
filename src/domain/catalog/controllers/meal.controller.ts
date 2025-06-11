import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMealDto } from '../dto/inbound/create-meal.dto';
import { UpdateMealDto } from '../dto/inbound/update-meal.dto';
import { MealService } from '../services/meal.service';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  create(@Body() createMealDto: CreateMealDto) {
    return this.mealService.create(createMealDto);
  }

  @Get()
  findAll() {
    return this.mealService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealService.findOne(+id);
  }

  @Get('/business/:businessId')
  findByBusiness(@Param('businessId', ParseIntPipe) id: number) {
    return this.mealService.findByBusinessId(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatemealDto: UpdateMealDto,
  ) {
    return this.mealService.update(id, updatemealDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealService.remove(id);
  }
}

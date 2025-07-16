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
import { CreateIngredientDto } from '../dto/inbound/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { IngredientService } from '../services/ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return await this.ingredientService.create(createIngredientDto);
  }

  // TODO, in the future we should only allow admins to fetch this endpoint
  @Get()
  async findAll() {
    return await this.ingredientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ingredientService.findOne(id);
  }

  @Get('/business/:businessId')
  async findByBusiness(@Param('businessId', ParseIntPipe) id: number) {
    return await this.ingredientService.findByBusinessId(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return await this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ingredientService.remove(id);
  }
}

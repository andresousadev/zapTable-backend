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
import { CreateCategoryDto } from '../dto/inbound/create-category.dto';
import { CategoryService } from '../services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOne(id);
  }

  @Get('/business/:businessId')
  async findByBusiness(@Param('businessId', ParseIntPipe) id: number) {
    return await this.categoryService.findByBusinessId(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoryService.update(id, createCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.remove(id);
  }
}

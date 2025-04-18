import { Controller, Get, Post } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  create(): string {
    return 'To be implemented';
  }

  @Get()
  findAll(): string {
    return 'To be implemented';
  }
}

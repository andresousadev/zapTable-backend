import { Controller, Get, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(): string {
    return 'To be implemented';
  }

  @Get()
  findAll(): string {
    return 'To be implemented';
  }
}

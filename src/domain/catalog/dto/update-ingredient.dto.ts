import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './inbound/create-ingredient.dto';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}

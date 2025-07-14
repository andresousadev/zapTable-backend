import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  photoSrc?: string;

  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  mealIds?: number[];
}

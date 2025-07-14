import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  menuIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  mealIds?: number[];
}

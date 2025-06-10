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

  @IsNumber()
  @IsNotEmpty()
  menu: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  mealIds: number[];
}

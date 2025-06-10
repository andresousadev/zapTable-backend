import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // TODO should be an array of photos
  @IsString()
  @IsOptional()
  photoSrc?: string;

  @IsString()
  @Matches(/^-?\d+(\.\d{1,2})?$/)
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  defaultPrice: string;

  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ingredientIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  availabilityIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  priceIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  customizationIds?: number[];
}

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
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
  defaultPrice: number;

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

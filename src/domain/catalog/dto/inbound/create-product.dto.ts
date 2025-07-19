import { Property } from '@mikro-orm/core';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
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

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  @IsString()
  @IsNotEmpty()
  // TODO add validation for non zero or negative values
  defaultPrice: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categories?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  ingredientIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  availabilityIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  priceIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  customizationIds?: string[];
}

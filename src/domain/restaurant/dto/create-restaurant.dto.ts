import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsPhoneNumber('PT')
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  photoSrc?: string;

  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  staffIds?: number[];
}

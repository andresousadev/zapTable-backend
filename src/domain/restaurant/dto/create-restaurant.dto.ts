import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

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

  @IsUUID()
  @IsNotEmpty()
  businessId: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  staffIds?: number[];
}

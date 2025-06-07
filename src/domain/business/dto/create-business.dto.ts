import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
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
  ownerId: number;
}

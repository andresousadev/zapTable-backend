import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
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
  @IsOptional()
  photoSrc?: string;

  @IsNumber()
  @IsNotEmpty()
  // TODO: Devia se verificar se o user atual é admin, e se não for
  // verificar que apenas o userId 123 consegue criar business para ownerId=123
  ownerId: number;
}

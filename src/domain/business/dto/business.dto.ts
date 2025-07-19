export class BusinessDto {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  photoSrc?: string;

  // For owner, we might want a simplified DTO or just the ID depending on context
  @IsUUID() // Assuming OwnerRole will have a simple ID representation in DTO
  ownerId!: string; // Only include ID, not full owner object in business DTO

  // Collections are typically exposed as arrays of their respective DTOs
  @Type(() => RestaurantDto)
  @IsOptional()
  restaurants?: RestaurantDto[]; // Simplified, usually only populated when explicitly requested

  @Type(() => CategoryDto)
  @IsOptional()
  categories?: CategoryDto[];

  @Type(() => ProductDto)
  @IsOptional()
  products?: ProductDto[];

  @Type(() => MenuDto)
  @IsOptional()
  menus?: MenuDto[];

  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;

  // Constructor to map entity to DTO (basic example, can use AutoMapper/class-transformer)
  constructor(partial: Partial<BusinessDto>) {
    Object.assign(this, partial);
    // If you were mapping from a Business entity, you'd do:
    // this.ownerId = partial.owner?.id;
    // this.restaurants = partial.restaurants?.getItems().map(r => new RestaurantDto(r));
    // etc.
  }
}
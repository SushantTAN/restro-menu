import { IsString, IsNotEmpty, IsNumber, IsMongoId, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  readonly price: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly restaurant: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}
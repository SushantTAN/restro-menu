import { IsString, IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly restaurant: string;
}

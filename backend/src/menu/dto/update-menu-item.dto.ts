import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}
import { PRODUCT_CATEGORIES, type ProductCategory, type ProductListQuery } from '@catalog/contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const SEARCH_MAX_LENGTH = 100;

export class ListProductsQueryDto implements ProductListQuery {
  @ApiPropertyOptional({ enum: PRODUCT_CATEGORIES, description: 'Фильтр по категории' })
  @IsOptional()
  @IsIn([...PRODUCT_CATEGORIES], { message: 'Неизвестная категория товара' })
  category?: ProductCategory;

  @ApiPropertyOptional({ maxLength: SEARCH_MAX_LENGTH, description: 'Поиск по названию' })
  @IsOptional()
  @IsString()
  @MaxLength(SEARCH_MAX_LENGTH)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;
}

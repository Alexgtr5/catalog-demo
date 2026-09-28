import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type ProductListResponse,
} from '@catalog/contracts';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto implements Product {
  @ApiProperty({ example: 'lp-01' })
  id: string;

  @ApiProperty({ example: 'Ноутбук Vector 14 Pro' })
  title: string;

  @ApiProperty({ enum: PRODUCT_CATEGORIES })
  category: ProductCategory;

  @ApiProperty({ example: 129990, description: 'Цена в рублях' })
  price: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    description: 'Набор характеристик; ключи у разных товаров отличаются',
    example: { Процессор: 'Apex M3, 8 ядер', Вес: '1.24 кг' },
  })
  characteristics: Record<string, string>;
}

export class ProductListResponseDto implements ProductListResponse {
  @ApiProperty({ type: [ProductDto] })
  items: ProductDto[];

  @ApiProperty({ example: 8, description: 'Количество товаров, подошедших под фильтр' })
  total: number;
}

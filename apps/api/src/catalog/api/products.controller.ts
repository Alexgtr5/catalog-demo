import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorDto } from '../../common/dto/api-error.dto.js';
import { ProductsService } from '../application/products.service.js';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';
import { ProductDto, ProductListResponseDto } from './dto/product.dto.js';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Список товаров с фильтром по категории и поиском по названию' })
  @ApiOkResponse({ type: ProductListResponseDto })
  list(@Query() query: ListProductsQueryDto): Promise<ProductListResponseDto> {
    return this.products.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Товар по идентификатору' })
  @ApiOkResponse({ type: ProductDto })
  @ApiNotFoundResponse({ type: ApiErrorDto })
  getById(@Param('id') id: string): Promise<ProductDto> {
    return this.products.getById(id);
  }
}

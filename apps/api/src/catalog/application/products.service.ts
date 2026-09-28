import type { Product, ProductListQuery, ProductListResponse } from '@catalog/contracts';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../common/errors/domain.error.js';
import { ProductRepository } from '../domain/product.repository.js';

@Injectable()
export class ProductsService {
  constructor(private readonly products: ProductRepository) {}

  async list(query: ProductListQuery): Promise<ProductListResponse> {
    const items = await this.products.findAll(query);

    return { items, total: items.length };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.products.findById(id);

    if (product === null) {
      throw new EntityNotFoundError('Товар', id);
    }

    return product;
  }
}

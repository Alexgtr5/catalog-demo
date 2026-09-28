import type { Product } from '@catalog/contracts';
import { Injectable } from '@nestjs/common';
import { ProductFilter, ProductRepository } from '../domain/product.repository.js';
import { PRODUCTS_SEED } from './products.seed.js';

@Injectable()
export class InMemoryProductRepository extends ProductRepository {
  private readonly products: readonly Product[] = PRODUCTS_SEED;

  findAll(filter: ProductFilter): Promise<Product[]> {
    const search = filter.search?.trim().toLowerCase();

    const items = this.products.filter((product) => {
      const matchesCategory = filter.category === undefined || product.category === filter.category;
      const matchesSearch = !search || product.title.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    return Promise.resolve(items);
  }

  findById(id: string): Promise<Product | null> {
    return Promise.resolve(this.products.find((product) => product.id === id) ?? null);
  }
}

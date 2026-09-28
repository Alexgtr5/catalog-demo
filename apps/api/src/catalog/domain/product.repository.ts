import type { Product, ProductCategory } from '@catalog/contracts';

export type ProductFilter = {
  category?: ProductCategory;
  search?: string;
};

/**
 * Абстрактный класс, а не интерфейс — Nest использует его как DI-токен,
 * поэтому замена in-memory реализации на СУБД не трогает сервис.
 */
export abstract class ProductRepository {
  abstract findAll(filter: ProductFilter): Promise<Product[]>;

  abstract findById(id: string): Promise<Product | null>;
}

import type { ProductCategory } from '@catalog/contracts';

export type { Product, ProductCategory } from '@catalog/contracts';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  laptops: 'Ноутбуки',
  phones: 'Смартфоны',
  headphones: 'Наушники',
};

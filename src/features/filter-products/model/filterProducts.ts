import type { Product, ProductCategory } from '../../../entities/product';

export type CatalogFilter = {
  category: ProductCategory | 'all';
  query: string;
};

export const INITIAL_FILTER: CatalogFilter = { category: 'all', query: '' };

export function filterProducts(products: Product[], filter: CatalogFilter): Product[] {
  const query = filter.query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = filter.category === 'all' || product.category === filter.category;
    const matchesQuery = query === '' || product.title.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });
}
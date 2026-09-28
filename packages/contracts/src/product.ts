export const PRODUCT_CATEGORIES = ['laptops', 'phones', 'headphones'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  characteristics: Record<string, string>;
};

export type ProductListQuery = {
  category?: ProductCategory;
  search?: string;
};

export type ProductListResponse = {
  items: Product[];
  total: number;
};

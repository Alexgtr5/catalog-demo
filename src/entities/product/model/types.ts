export type ProductCategory = 'laptops' | 'phones' | 'headphones';

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  characteristics: Record<string, string>;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  laptops: 'Ноутбуки',
  phones: 'Смартфоны',
  headphones: 'Наушники',
};
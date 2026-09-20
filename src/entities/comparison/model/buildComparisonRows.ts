import type { Product } from '../../product';

export type ComparisonRow = {
  label: string;
  values: (string | null)[];
};

export function buildComparisonRows(products: Product[]): ComparisonRow[] {
  const labels = Array.from(
    new Set(products.flatMap((product) => Object.keys(product.characteristics))),
  );

  return labels.map((label) => ({
    label,
    values: products.map((product) => product.characteristics[label] ?? null),
  }));
}
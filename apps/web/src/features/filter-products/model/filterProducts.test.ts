import { describe, expect, test } from 'vitest';
import type { Product } from '../../../entities/product';
import { filterProducts } from './filterProducts';

const products: Product[] = [
  { id: '1', title: 'Ноутбук Vector', category: 'laptops', price: 100, characteristics: {} },
  { id: '2', title: 'Смартфон Nova', category: 'phones', price: 200, characteristics: {} },
];

describe('filterProducts', () => {
  test('без фильтров возвращает все товары', () => {
    expect(filterProducts(products, { category: 'all', query: '' })).toHaveLength(2);
  });

  test('фильтрует по категории', () => {
    const result = filterProducts(products, { category: 'phones', query: '' });

    expect(result.map((product) => product.id)).toEqual(['2']);
  });

  test('ищет по названию без учёта регистра и пробелов по краям', () => {
    const result = filterProducts(products, { category: 'all', query: '  VECTOR ' });

    expect(result.map((product) => product.id)).toEqual(['1']);
  });
});
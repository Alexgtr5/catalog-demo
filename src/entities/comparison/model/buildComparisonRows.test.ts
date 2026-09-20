import { describe, expect, test } from 'vitest';
import type { Product } from '../../product';
import { buildComparisonRows } from './buildComparisonRows';

function makeProduct(id: string, characteristics: Record<string, string>): Product {
  return { id, title: `Товар ${id}`, category: 'laptops', price: 1000, characteristics };
}

describe('buildComparisonRows', () => {
  test('строит строку на каждую характеристику из объединения всех товаров', () => {
    const rows = buildComparisonRows([
      makeProduct('1', { Экран: '14"', Вес: '1.2 кг' }),
      makeProduct('2', { Экран: '16"', Видеокарта: 'RTX 5070' }),
    ]);

    expect(rows.map((row) => row.label)).toEqual(['Экран', 'Вес', 'Видеокарта']);
  });

  test('подставляет null там, где характеристики у товара нет', () => {
    const rows = buildComparisonRows([
      makeProduct('1', { Цвет: 'красный' }),
      makeProduct('2', {}),
    ]);

    expect(rows).toEqual([{ label: 'Цвет', values: ['красный', null] }]);
  });

  test('порядок значений в строке соответствует порядку товаров', () => {
    const rows = buildComparisonRows([
      makeProduct('1', { Память: '8 ГБ' }),
      makeProduct('2', { Память: '16 ГБ' }),
      makeProduct('3', { Память: '32 ГБ' }),
    ]);

    expect(rows[0].values).toEqual(['8 ГБ', '16 ГБ', '32 ГБ']);
  });

  test('не дублирует строку, если характеристика есть у всех товаров', () => {
    const rows = buildComparisonRows([
      makeProduct('1', { Экран: '14"' }),
      makeProduct('2', { Экран: '16"' }),
    ]);

    expect(rows).toHaveLength(1);
  });

  test('на пустом списке товаров возвращает пустой набор строк', () => {
    expect(buildComparisonRows([])).toEqual([]);
  });
});
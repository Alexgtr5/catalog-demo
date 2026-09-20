import { describe, expect, test } from 'vitest';
import { COMPARISON_LIMIT, toggleComparison } from './toggleComparison';

describe('toggleComparison', () => {
  test('добавляет товар, если лимит не достигнут', () => {
    const result = toggleComparison(['a'], 'b');

    expect(result).toEqual({ ids: ['a', 'b'], limitReached: false });
  });

  test('убирает товар, который уже есть в сравнении', () => {
    const result = toggleComparison(['a', 'b'], 'a');

    expect(result).toEqual({ ids: ['b'], limitReached: false });
  });

  test('при попытке добавить сверх лимита не меняет состав и сообщает о лимите', () => {
    const full = ['a', 'b', 'c'];

    const result = toggleComparison(full, 'd');

    expect(result.limitReached).toBe(true);
    expect(result.ids).toEqual(full);
  });

  test('на заполненном лимите удаление по-прежнему работает', () => {
    const result = toggleComparison(['a', 'b', 'c'], 'b');

    expect(result).toEqual({ ids: ['a', 'c'], limitReached: false });
  });

  test('лимит равен трём товарам', () => {
    expect(COMPARISON_LIMIT).toBe(3);
  });
});
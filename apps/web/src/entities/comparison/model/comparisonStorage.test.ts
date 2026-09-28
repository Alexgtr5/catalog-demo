import { afterEach, describe, expect, test } from 'vitest';
import { readComparison, writeComparison } from './comparisonStorage';

const LIMIT = 3;

afterEach(() => {
  sessionStorage.clear();
});

describe('comparisonStorage', () => {
  test('возвращает пустой список, если в хранилище ничего нет', () => {
    expect(readComparison(LIMIT)).toEqual([]);
  });

  test('читает то, что было записано', () => {
    writeComparison(['a', 'b']);

    expect(readComparison(LIMIT)).toEqual(['a', 'b']);
  });

  test('не падает на повреждённых данных и возвращает пустой список', () => {
    sessionStorage.setItem('comparison:product-ids', '{не json');

    expect(readComparison(LIMIT)).toEqual([]);
  });

  test('игнорирует значение, не являющееся массивом', () => {
    sessionStorage.setItem('comparison:product-ids', '{"id":"a"}');

    expect(readComparison(LIMIT)).toEqual([]);
  });

  test('отбрасывает элементы, не являющиеся строками', () => {
    sessionStorage.setItem('comparison:product-ids', '["a", 42, null, "b"]');

    expect(readComparison(LIMIT)).toEqual(['a', 'b']);
  });

  test('обрезает список до лимита, если в хранилище оказалось больше id', () => {
    writeComparison(['a', 'b', 'c', 'd', 'e']);

    expect(readComparison(LIMIT)).toEqual(['a', 'b', 'c']);
  });
});
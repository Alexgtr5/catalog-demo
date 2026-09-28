import type { Product } from '@catalog/contracts';
import { afterEach, expect, test, vi } from 'vitest';
import { fetchProducts } from './productsApi';

const LAPTOP: Product = {
  id: 'lp-01',
  title: 'Ноутбук Vector 14 Pro',
  category: 'laptops',
  price: 129990,
  characteristics: { Вес: '1.24 кг' },
};

function mockFetch(response: Partial<Response>) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

test('товары достаются из конверта ответа', async () => {
  const fetchMock = mockFetch({
    ok: true,
    json: () => Promise.resolve({ items: [LAPTOP], total: 1 }),
  });

  await expect(fetchProducts()).resolves.toEqual([LAPTOP]);
  expect(fetchMock).toHaveBeenCalledWith('/api/v1/products', expect.anything());
});

test('ответ с ошибкой превращается в исключение', async () => {
  mockFetch({ ok: false, status: 503 });

  await expect(fetchProducts()).rejects.toThrow('503');
});

test('?fail=1 роняет загрузку не обращаясь к сети', async () => {
  const fetchMock = mockFetch({ ok: true, json: () => Promise.resolve({ items: [], total: 0 }) });
  window.history.replaceState({}, '', '/?fail=1');

  await expect(fetchProducts()).rejects.toThrow('Не удалось загрузить каталог');
  expect(fetchMock).not.toHaveBeenCalled();
});

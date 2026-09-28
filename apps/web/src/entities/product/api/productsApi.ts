import type { Product, ProductListResponse } from '@catalog/contracts';

// Относительный путь: в разработке его проксирует Vite, в продакшне — хостинг.
const PRODUCTS_URL = '/api/v1/products';

// ?fail=1 в URL позволяет проверить состояние ошибки на дев-стенде без правок кода
function shouldFail(): boolean {
  return new URLSearchParams(window.location.search).get('fail') === '1';
}

export async function fetchProducts(): Promise<Product[]> {
  if (shouldFail()) {
    throw new Error('Не удалось загрузить каталог');
  }

  const response = await fetch(PRODUCTS_URL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Каталог не загрузился: ${response.status}`);
  }

  const { items }: ProductListResponse = await response.json();

  return items;
}

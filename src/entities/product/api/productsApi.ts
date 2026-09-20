import type { Product } from '../model/types';
import { PRODUCTS_MOCK } from './productsMock';

const NETWORK_DELAY_MS = 700;

// ?fail=1 в URL позволяет проверить состояние ошибки на дев-стенде без правок кода
function shouldFail(): boolean {
  return new URLSearchParams(window.location.search).get('fail') === '1';
}

export function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error('Не удалось загрузить каталог'));
        return;
      }
      resolve(PRODUCTS_MOCK);
    }, NETWORK_DELAY_MS);
  });
}
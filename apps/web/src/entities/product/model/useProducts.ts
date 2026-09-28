import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../api/productsApi';
import type { Product } from './types';

type ProductsState = {
  products: Product[];
  status: 'loading' | 'success' | 'error';
};

const LOADING_STATE: ProductsState = { products: [], status: 'loading' };

export function useProducts() {
  const [state, setState] = useState<ProductsState>(LOADING_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((products) => {
        if (!cancelled) setState({ products, status: 'success' });
      })
      .catch(() => {
        if (!cancelled) setState({ products: [], status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState(LOADING_STATE);
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, reload };
}
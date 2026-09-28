import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ComparisonContext } from './comparisonContext';
import { readComparison, writeComparison } from './comparisonStorage';
import { COMPARISON_LIMIT, toggleComparison, type ToggleResult } from './toggleComparison';

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>(() => readComparison(COMPARISON_LIMIT));

  useEffect(() => {
    writeComparison(productIds);
  }, [productIds]);

  const toggle = useCallback(
    (productId: string): ToggleResult => {
      const result = toggleComparison(productIds, productId);
      setProductIds(result.ids);
      return result;
    },
    [productIds],
  );

  const remove = useCallback((productId: string) => {
    setProductIds((current) => current.filter((id) => id !== productId));
  }, []);

  const isInComparison = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const value = useMemo(
    () => ({ productIds, toggle, remove, isInComparison }),
    [productIds, toggle, remove, isInComparison],
  );

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}
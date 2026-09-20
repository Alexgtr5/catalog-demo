import { useContext } from 'react';
import { ComparisonContext } from './comparisonContext';

export function useComparison() {
  const value = useContext(ComparisonContext);

  if (!value) {
    throw new Error('useComparison должен использоваться внутри ComparisonProvider');
  }

  return value;
}
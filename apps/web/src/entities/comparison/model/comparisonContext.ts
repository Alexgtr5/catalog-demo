import { createContext } from 'react';
import type { ToggleResult } from './toggleComparison';

export type ComparisonContextValue = {
  productIds: string[];
  toggle: (productId: string) => ToggleResult;
  remove: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
};

export const ComparisonContext = createContext<ComparisonContextValue | null>(null);
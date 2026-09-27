export const COMPARISON_LIMIT = 3;

export type ToggleResult = {
  ids: string[];
  limitReached: boolean;
};

export function toggleComparison(ids: string[], productId: string): ToggleResult {
  if (ids.includes(productId)) {
    return { ids: ids.filter((id) => id !== productId), limitReached: false };
  }

  if (ids.length >= COMPARISON_LIMIT) {
    return { ids, limitReached: true };
  }

  return { ids: [...ids, productId], limitReached: false };
}
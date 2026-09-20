const STORAGE_KEY = 'comparison:product-ids';

export function readComparison(limit: number): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is string => typeof id === 'string').slice(0, limit);
  } catch {
    return [];
  }
}

export function writeComparison(ids: string[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // в приватном режиме запись запрещена — сравнение продолжает работать в памяти
  }
}
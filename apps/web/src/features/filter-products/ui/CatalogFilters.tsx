import { Button, TextField } from '../../../shared/ui';
import { CATEGORY_LABELS, type ProductCategory } from '../../../entities/product';
import type { CatalogFilter } from '../model/filterProducts';
import styles from './CatalogFilters.module.css';

const CATEGORY_OPTIONS: Array<{ value: ProductCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Все товары' },
  ...(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  })),
];

type CatalogFiltersProps = {
  filter: CatalogFilter;
  onChange: (filter: CatalogFilter) => void;
};

export function CatalogFilters({ filter, onChange }: CatalogFiltersProps) {
  return (
    <div className={styles.root}>
      <div className={styles.categories}>
        {CATEGORY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filter.category === option.value ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={filter.category === option.value}
            onClick={() => onChange({ ...filter, category: option.value })}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div className={styles.search}>
        <TextField
          type="search"
          value={filter.query}
          placeholder="Поиск по названию"
          aria-label="Поиск по названию"
          onChange={(event) => onChange({ ...filter, query: event.target.value })}
        />
      </div>
    </div>
  );
}
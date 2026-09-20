import { useMemo, useState } from 'react';
import { Button, EmptyState, Skeleton } from '../../../shared/ui';
import { ProductCard, useProducts } from '../../../entities/product';
import { CatalogFilters, filterProducts, INITIAL_FILTER } from '../../../features/filter-products';
import styles from './CatalogGrid.module.css';

const SKELETON_COUNT = 6;

export function CatalogGrid() {
  const { products, status, reload } = useProducts();
  const [filter, setFilter] = useState(INITIAL_FILTER);

  const visibleProducts = useMemo(() => filterProducts(products, filter), [products, filter]);

  if (status === 'loading') {
    return (
      <div className={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <Skeleton height="120px" />
            <Skeleton width="60%" />
            <Skeleton width="80%" />
            <Skeleton width="40%" height="22px" />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        variant="error"
        title="Не удалось загрузить каталог"
        description="Проверьте соединение и попробуйте ещё раз."
        action={<Button onClick={reload}>Повторить</Button>}
      />
    );
  }

  return (
    <>
      <CatalogFilters filter={filter} onChange={setFilter} />
      {visibleProducts.length === 0 ? (
        <EmptyState
          title="Товары не найдены"
          description="Попробуйте изменить запрос или выбрать другую категорию."
          action={<Button variant="secondary" onClick={() => setFilter(INITIAL_FILTER)}>Сбросить фильтры</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
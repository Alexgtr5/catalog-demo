import { useMemo } from 'react';
import { Card, CardBody, EmptyState } from '../../../shared/ui';
import type { Product } from '../../../entities/product';
import { COMPARISON_LIMIT, useComparison } from '../../../entities/comparison';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonTableSkeleton } from './ComparisonTableSkeleton';
import styles from './ComparisonWidget.module.css';

const MIN_PRODUCTS_TO_COMPARE = 2;

type ComparisonWidgetProps = {
  products: Product[];
  status: 'loading' | 'success' | 'error';
};

export function ComparisonWidget({ products, status }: ComparisonWidgetProps) {
  const { productIds, remove } = useComparison();

  // id, которым не соответствует товар в загруженном каталоге, отбрасываются;
  // сам список в хранилище при этом не очищается
  const selectedProducts = useMemo(
    () =>
      productIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => product !== undefined),
    [productIds, products],
  );

  if (status === 'error') {
    return null;
  }

  const isLoading = status === 'loading' && productIds.length > 0;

  const content = isLoading ? (
    <ComparisonTableSkeleton />
  ) : selectedProducts.length < MIN_PRODUCTS_TO_COMPARE ? (
    <EmptyState
      title="Добавьте ещё товары для сравнения"
      description={`Выберите минимум ${MIN_PRODUCTS_TO_COMPARE} товара кнопкой «Добавить к сравнению» на карточке.`}
    />
  ) : (
    <ComparisonTable products={selectedProducts} onRemove={remove} />
  );

  return (
    <section className={styles.section} aria-labelledby="comparison-title" aria-busy={isLoading}>
      <Card>
        <CardBody>
          <div className={styles.header}>
            <h2 id="comparison-title" className={styles.title}>
              Сравнение товаров
            </h2>
            <span className={styles.counter}>
              {selectedProducts.length} из {COMPARISON_LIMIT}
            </span>
          </div>

          {content}
        </CardBody>
      </Card>
    </section>
  );
}
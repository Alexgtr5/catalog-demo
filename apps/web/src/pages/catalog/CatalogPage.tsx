import { useProducts } from '../../entities/product';
import { CatalogGrid } from '../../widgets/catalog';
import { ComparisonWidget } from '../../widgets/comparison';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  const { products, status, reload } = useProducts();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Каталог товаров</h1>
        <p className={styles.subtitle}>Электроника для работы, связи и звука</p>
      </header>
      <ComparisonWidget products={products} status={status} />
      <CatalogGrid products={products} status={status} onReload={reload} />
    </main>
  );
}
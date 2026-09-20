import { CatalogGrid } from '../../widgets/catalog';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Каталог товаров</h1>
        <p className={styles.subtitle}>Электроника для работы, связи и звука</p>
      </header>
      <CatalogGrid />
    </main>
  );
}
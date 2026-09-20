import { Button } from '../../../shared/ui';
import { formatPrice } from '../../../shared/lib/formatPrice';
import type { Product } from '../../../entities/product';
import { buildComparisonRows } from '../../../entities/comparison';
import styles from './ComparisonTable.module.css';

type ComparisonTableProps = {
  products: Product[];
  onRemove: (productId: string) => void;
};

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  const rows = buildComparisonRows(products);

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>Сравнение выбранных товаров</caption>
        <thead>
          <tr>
            <td className={styles.labelCell} />
            {products.map((product) => (
              <th key={product.id} scope="col" className={styles.columnHeader}>
                <span className={styles.productTitle}>{product.title}</span>
                <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Убрать «${product.title}» из сравнения`}
                  onClick={() => onRemove(product.id)}
                >
                  Убрать
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={styles.labelCell}>
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={products[index].id} className={styles.valueCell}>
                  {value ?? <span className={styles.missing}>—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
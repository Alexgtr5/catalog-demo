import type { ReactNode } from 'react';
import { Card, CardBody } from '../../../shared/ui';
import { formatPrice } from '../../../shared/lib/formatPrice';
import { CATEGORY_LABELS, type Product, type ProductCategory } from '../model/types';
import styles from './ProductCard.module.css';

const COVER_GRADIENTS: Record<ProductCategory, string> = {
  laptops: 'linear-gradient(135deg, #2f6fed, #6ea8ff)',
  phones: 'linear-gradient(135deg, #7048e8, #b197fc)',
  headphones: 'linear-gradient(135deg, #0ca678, #63e6be)',
};

const PREVIEW_SPECS_COUNT = 3;

type ProductCardProps = {
  product: Product;
  footer?: ReactNode;
};

export function ProductCard({ product, footer }: ProductCardProps) {
  const previewSpecs = Object.entries(product.characteristics).slice(0, PREVIEW_SPECS_COUNT);

  return (
    <Card interactive>
      <div className={styles.cover} style={{ background: COVER_GRADIENTS[product.category] }}>
        {product.title.slice(0, 1)}
      </div>
      <CardBody>
        <span className={styles.category}>{CATEGORY_LABELS[product.category]}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <dl className={styles.specs}>
          {previewSpecs.map(([label, value]) => (
            <div key={label} className={styles.specRow}>
              <dt>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </div>
          ))}
        </dl>
        <span className={styles.price}>{formatPrice(product.price)}</span>
      </CardBody>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
  );
}
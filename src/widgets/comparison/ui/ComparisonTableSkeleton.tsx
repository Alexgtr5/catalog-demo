import { Skeleton } from '../../../shared/ui';
import styles from './ComparisonTable.module.css';

const ROWS_COUNT = 4;

export function ComparisonTableSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-hidden="true">
      {Array.from({ length: ROWS_COUNT }, (_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton />
        </div>
      ))}
    </div>
  );
}
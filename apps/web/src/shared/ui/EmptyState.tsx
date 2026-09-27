import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

type EmptyStateProps = {
  variant?: 'neutral' | 'error';
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ variant = 'neutral', title, description, action }: EmptyStateProps) {
  const classes = [styles.root, variant === 'error' && styles.error].filter(Boolean).join(' ');

  return (
    <div className={classes} role={variant === 'error' ? 'alert' : undefined}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
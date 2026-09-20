import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { ToastContext, type ToastVariant } from './toastContext';
import styles from './Toast.module.css';

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={styles.viewport}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={[styles.toast, toast.variant === 'warning' && styles.warning]
              .filter(Boolean)
              .join(' ')}
          >
            <span>{toast.message}</span>
            <Button
              variant="ghost"
              size="sm"
              className={styles.close}
              onClick={() => dismiss(toast.id)}
              aria-label="Закрыть уведомление"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
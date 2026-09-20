import { createContext } from 'react';

export type ToastVariant = 'info' | 'warning';

export type ShowToast = (message: string, variant?: ToastVariant) => void;

export const ToastContext = createContext<ShowToast | null>(null);
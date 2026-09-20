import type { InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';

export function TextField({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={[styles.input, className].filter(Boolean).join(' ')} {...rest} />;
}
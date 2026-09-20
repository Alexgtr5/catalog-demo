import { ToastProvider } from '../shared/ui';
import { CatalogPage } from '../pages/catalog/CatalogPage';

export function App() {
  return (
    <ToastProvider>
      <CatalogPage />
    </ToastProvider>
  );
}
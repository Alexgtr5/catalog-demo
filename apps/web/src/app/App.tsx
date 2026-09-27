import { ToastProvider } from '../shared/ui';
import { ComparisonProvider } from '../entities/comparison';
import { CatalogPage } from '../pages/catalog/CatalogPage';

export function App() {
  return (
    <ToastProvider>
      <ComparisonProvider>
        <CatalogPage />
      </ComparisonProvider>
    </ToastProvider>
  );
}
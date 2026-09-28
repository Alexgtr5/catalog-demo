import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ToastProvider } from '../../../shared/ui';
import { ComparisonProvider } from '../../../entities/comparison';
import type { Product } from '../../../entities/product';
import { CatalogGrid } from './CatalogGrid';

const products: Product[] = [
  {
    id: 'lp-01',
    title: 'Ноутбук Vector 14 Pro',
    category: 'laptops',
    price: 129990,
    characteristics: { 'Оперативная память': '16 ГБ' },
  },
  {
    id: 'ph-01',
    title: 'Смартфон Nova 12',
    category: 'phones',
    price: 74990,
    characteristics: { Память: '256 ГБ' },
  },
];

function renderGrid(children: ReactNode) {
  return render(
    <ToastProvider>
      <ComparisonProvider>{children}</ComparisonProvider>
    </ToastProvider>,
  );
}

test('показывает товары после загрузки', () => {
  renderGrid(<CatalogGrid products={products} status="success" onReload={vi.fn()} />);

  expect(screen.getByText('Ноутбук Vector 14 Pro')).toBeInTheDocument();
});

test('показывает заглушку, если под запрос не подходит ни один товар', async () => {
  renderGrid(<CatalogGrid products={products} status="success" onReload={vi.fn()} />);

  await userEvent.type(screen.getByLabelText('Поиск по названию'), 'телевизор');

  expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
});

test('сброс фильтров возвращает товары в выдачу', async () => {
  renderGrid(<CatalogGrid products={products} status="success" onReload={vi.fn()} />);
  await userEvent.type(screen.getByLabelText('Поиск по названию'), 'телевизор');

  await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));

  expect(screen.getByText('Ноутбук Vector 14 Pro')).toBeInTheDocument();
});
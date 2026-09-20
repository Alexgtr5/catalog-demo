import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import { ToastProvider } from '../../../shared/ui';
import { ComparisonProvider } from '../../../entities/comparison';
import type { Product } from '../../../entities/product';
import { ComparisonWidget } from './ComparisonWidget';

const products: Product[] = [
  {
    id: 'lp-01',
    title: 'Ноутбук Vector 14 Pro',
    category: 'laptops',
    price: 129990,
    characteristics: { Экран: '14"', Вес: '1.24 кг' },
  },
  {
    id: 'lp-03',
    title: 'Ноутбук Forge 16 Gaming',
    category: 'laptops',
    price: 189990,
    characteristics: { Экран: '16"', Вес: '2.4 кг', Видеокарта: 'RTX 5070' },
  },
];

function renderWidget(status: 'loading' | 'success' | 'error', selectedIds: string[] = []) {
  sessionStorage.setItem('comparison:product-ids', JSON.stringify(selectedIds));

  return render(
    <ToastProvider>
      <ComparisonProvider>
        <ComparisonWidget products={status === 'success' ? products : []} status={status} />
      </ComparisonProvider>
    </ToastProvider>,
  );
}

afterEach(() => {
  sessionStorage.clear();
});

test('без выбранных товаров показывает заглушку', () => {
  renderWidget('success');

  expect(screen.getByText('Добавьте ещё товары для сравнения')).toBeInTheDocument();
});

test('с одним выбранным товаром всё ещё показывает заглушку', () => {
  renderWidget('success', ['lp-01']);

  expect(screen.getByText('Добавьте ещё товары для сравнения')).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('с двумя выбранными товарами показывает таблицу сравнения', () => {
  renderWidget('success', ['lp-01', 'lp-03']);

  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /Ноутбук Vector 14 Pro/ })).toBeInTheDocument();
});

test('характеристика, которой нет у товара, отображается прочерком', () => {
  renderWidget('success', ['lp-01', 'lp-03']);

  const videoRow = screen.getByRole('rowheader', { name: 'Видеокарта' }).closest('tr');

  expect(videoRow).not.toBeNull();
  expect(videoRow).toHaveTextContent('RTX 5070');
  expect(videoRow).toHaveTextContent('—');
});

test('удаление товара из таблицы убирает его столбец и перестраивает строки', async () => {
  renderWidget('success', ['lp-01', 'lp-03']);

  await userEvent.click(
    screen.getByRole('button', { name: 'Убрать «Ноутбук Forge 16 Gaming» из сравнения' }),
  );

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.getByText('Добавьте ещё товары для сравнения')).toBeInTheDocument();
});

test('пока каталог грузится и есть выбранные товары, показывает скелетон вместо заглушки', () => {
  renderWidget('loading', ['lp-01', 'lp-03']);

  expect(screen.queryByText('Добавьте ещё товары для сравнения')).not.toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Сравнение товаров' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
});

test('при ошибке загрузки каталога виджет не отображается', () => {
  renderWidget('error', ['lp-01', 'lp-03']);

  expect(screen.queryByRole('region', { name: 'Сравнение товаров' })).not.toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('id, которому не соответствует товар в каталоге, отбрасывается', () => {
  renderWidget('success', ['lp-01', 'lp-03', 'удалённый-товар']);

  expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  expect(screen.getByText('2 из 3')).toBeInTheDocument();
});

test('отбрасывание неизвестных id не очищает хранилище', () => {
  renderWidget('success', ['lp-01', 'удалённый-товар']);

  expect(JSON.parse(sessionStorage.getItem('comparison:product-ids') ?? '[]')).toEqual([
    'lp-01',
    'удалённый-товар',
  ]);
});
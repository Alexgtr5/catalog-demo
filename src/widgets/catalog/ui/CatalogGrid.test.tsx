import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { CatalogGrid } from './CatalogGrid';

test('показывает товары после загрузки', async () => {
  render(<CatalogGrid />);

  expect(await screen.findByText('Ноутбук Vector 14 Pro')).toBeInTheDocument();
});

test('показывает заглушку, если под запрос не подходит ни один товар', async () => {
  render(<CatalogGrid />);
  await screen.findByText('Ноутбук Vector 14 Pro');

  await userEvent.type(screen.getByLabelText('Поиск по названию'), 'телевизор');

  expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
});

test('сброс фильтров возвращает товары в выдачу', async () => {
  render(<CatalogGrid />);
  await screen.findByText('Ноутбук Vector 14 Pro');
  await userEvent.type(screen.getByLabelText('Поиск по названию'), 'телевизор');

  await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));

  expect(screen.getByText('Ноутбук Vector 14 Pro')).toBeInTheDocument();
});
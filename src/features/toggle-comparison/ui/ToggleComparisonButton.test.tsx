import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import { ToastProvider } from '../../../shared/ui';
import { ComparisonProvider } from '../../../entities/comparison';
import { ToggleComparisonButton } from './ToggleComparisonButton';

function renderButtons(ids: string[]) {
  return render(
    <ToastProvider>
      <ComparisonProvider>
        {ids.map((id) => (
          <ToggleComparisonButton key={id} productId={id} />
        ))}
      </ComparisonProvider>
    </ToastProvider>,
  );
}

afterEach(() => {
  sessionStorage.clear();
});

test('по умолчанию кнопка не нажата и предлагает добавить товар', () => {
  renderButtons(['a']);

  expect(screen.getByRole('button', { name: 'Добавить к сравнению' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('клик добавляет товар и переводит кнопку в нажатое состояние', async () => {
  renderButtons(['a']);

  await userEvent.click(screen.getByRole('button', { name: 'Добавить к сравнению' }));

  expect(screen.getByRole('button', { name: 'В сравнении' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('повторный клик убирает товар из сравнения', async () => {
  renderButtons(['a']);
  await userEvent.click(screen.getByRole('button', { name: 'Добавить к сравнению' }));

  await userEvent.click(screen.getByRole('button', { name: 'В сравнении' }));

  expect(screen.getByRole('button', { name: 'Добавить к сравнению' })).toBeInTheDocument();
});

test('выбор сохраняется в sessionStorage', async () => {
  renderButtons(['a']);

  await userEvent.click(screen.getByRole('button', { name: 'Добавить к сравнению' }));

  expect(JSON.parse(sessionStorage.getItem('comparison:product-ids') ?? '[]')).toEqual(['a']);
});

test('попытка добавить четвёртый товар показывает уведомление о лимите', async () => {
  sessionStorage.setItem('comparison:product-ids', JSON.stringify(['a', 'b', 'c']));
  renderButtons(['a', 'b', 'c', 'd']);

  await userEvent.click(screen.getByRole('button', { name: 'Добавить к сравнению' }));

  expect(await screen.findByRole('status')).toHaveTextContent(
    'Можно сравнить не больше 3 товаров',
  );
  expect(screen.getByRole('button', { name: 'Добавить к сравнению' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('на заполненном лимите повторные нажатия не плодят уведомления', async () => {
  sessionStorage.setItem('comparison:product-ids', JSON.stringify(['a', 'b', 'c']));
  renderButtons(['a', 'b', 'c', 'd']);
  const addButton = screen.getByRole('button', { name: 'Добавить к сравнению' });

  await userEvent.click(addButton);
  await userEvent.click(addButton);
  await userEvent.click(addButton);

  expect(screen.getAllByRole('status')).toHaveLength(1);
});

test('при достигнутом лимите уже выбранный товар по-прежнему можно убрать', async () => {
  sessionStorage.setItem('comparison:product-ids', JSON.stringify(['a', 'b', 'c']));
  renderButtons(['a', 'b', 'c', 'd']);

  await userEvent.click(screen.getAllByRole('button', { name: 'В сравнении' })[0]);

  expect(screen.getAllByRole('button', { name: 'Добавить к сравнению' })).toHaveLength(2);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
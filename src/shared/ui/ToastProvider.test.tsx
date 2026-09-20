import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Trigger({ message, label }: { message: string; label: string }) {
  const showToast = useToast();

  return <button onClick={() => showToast(message, 'warning')}>{label}</button>;
}

test('показывает уведомление после вызова showToast', async () => {
  render(
    <ToastProvider>
      <Trigger message="Лимит достигнут" label="показать" />
    </ToastProvider>,
  );

  await userEvent.click(screen.getByRole('button', { name: 'показать' }));

  expect(screen.getByRole('status')).toHaveTextContent('Лимит достигнут');
});

test('не дублирует уведомление с тем же текстом', async () => {
  render(
    <ToastProvider>
      <Trigger message="Лимит достигнут" label="показать" />
    </ToastProvider>,
  );
  const trigger = screen.getByRole('button', { name: 'показать' });

  await userEvent.click(trigger);
  await userEvent.click(trigger);

  expect(screen.getAllByRole('status')).toHaveLength(1);
});

test('уведомления с разным текстом показываются одновременно', async () => {
  render(
    <ToastProvider>
      <Trigger message="Первое" label="первый" />
      <Trigger message="Второе" label="второй" />
    </ToastProvider>,
  );

  await userEvent.click(screen.getByRole('button', { name: 'первый' }));
  await userEvent.click(screen.getByRole('button', { name: 'второй' }));

  expect(screen.getAllByRole('status')).toHaveLength(2);
});

test('после закрытия то же сообщение можно показать снова', async () => {
  render(
    <ToastProvider>
      <Trigger message="Лимит достигнут" label="показать" />
    </ToastProvider>,
  );
  const trigger = screen.getByRole('button', { name: 'показать' });
  await userEvent.click(trigger);

  await userEvent.click(screen.getByRole('button', { name: 'Закрыть уведомление' }));
  await userEvent.click(trigger);

  expect(screen.getAllByRole('status')).toHaveLength(1);
});
import { Button, useToast } from '../../../shared/ui';
import { COMPARISON_LIMIT, useComparison } from '../../../entities/comparison';

export function ToggleComparisonButton({ productId }: { productId: string }) {
  const { toggle, isInComparison } = useComparison();
  const showToast = useToast();

  const inComparison = isInComparison(productId);

  const handleClick = () => {
    const { limitReached } = toggle(productId);

    if (limitReached) {
      showToast(`Можно сравнить не больше ${COMPARISON_LIMIT} товаров`, 'warning');
    }
  };

  return (
    <Button
      variant={inComparison ? 'primary' : 'secondary'}
      size="sm"
      block
      aria-pressed={inComparison}
      onClick={handleClick}
    >
      {inComparison ? 'В сравнении' : 'Добавить к сравнению'}
    </Button>
  );
}
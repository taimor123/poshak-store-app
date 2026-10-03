'use client';
import { cn } from '@/lib/cn';
import type { ProductCard as Product } from '@/lib/catalog/types';
import { useShopper } from '@/stores/shopper';
import { toast, useUi } from '@/stores/ui';
import { HeartIcon } from '@/components/ui/icons';

/** Save / remove from wishlist. `overlay` = round white button on product images. */
export function WishButton({ product, variant = 'overlay' }: { product: Product; variant?: 'overlay' | 'inline' }) {
  const hydrated = useUi((s) => s.hydrated);
  const saved = useShopper((s) => s.wishlist.includes(product.slug));
  const toggleWish = useShopper((s) => s.toggleWish);
  const prime = useUi((s) => s.primeProducts);
  const on = hydrated && saved;

  const onClick = () => {
    prime([product]);
    toast(toggleWish(product.slug) ? 'Saved to your wishlist' : 'Removed from your wishlist');
  };

  if (variant === 'inline')
    return (
      <button type="button" className="icon-btn -mt-0.5 border border-line bg-surface text-brand" aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'} onClick={onClick}>
        <HeartIcon size={20} filled={on} />
      </button>
    );

  return (
    <button
      type="button"
      className="group absolute top-1 right-1 z-2 flex size-11 items-center justify-center rounded-full"
      aria-pressed={on}
      aria-label={`${on ? 'Remove' : 'Save'} ${product.name} ${on ? 'from' : 'to'} wishlist`}
      onClick={onClick}
    >
      <span className={cn('flex size-[34px] items-center justify-center rounded-full bg-surface text-brand shadow-card group-hover:bg-selected')}>
        <HeartIcon size={18} filled={on} />
      </span>
    </button>
  );
}

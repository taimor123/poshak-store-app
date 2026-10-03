'use client';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useCartDetails } from '@/hooks/useCartDetails';
import { formatPKR } from '@/lib/format';
import { useUi } from '@/stores/ui';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { Drawer } from '@/components/ui/Overlay';
import { Skeleton } from '@/components/ui/Skeleton';
import { LineThumb } from './ProductImage';

/** Right-side cart drawer. Opens automatically after add-to-cart. */
export function MiniCart() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const close = () => setOpen(false);
  const { lines, count, subtotalPaisa, loading } = useCartDetails();

  return (
    <Drawer open={open} onClose={close} label="Your cart" side="right" width="w-[min(400px,92vw)]" title={<span className="text-group font-semibold">Your cart ({count})</span>}>
      {count === 0 ? (
        <div className="flex flex-1 flex-col p-5">
          <EmptyState
            className="border-0"
            title="Your cart is empty"
            body="Browse this week’s arrivals, then come back here."
            action={<ButtonLink href={routes.category('new')} onClick={close}>Shop new arrivals</ButtonLink>}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5" aria-busy={loading}>
            {loading
              ? Array.from({ length: Math.min(count, 3) }, (_, i) => <Skeleton key={i} className="h-24 rounded-card" />)
              : lines.map((l) => (
                  <div key={l.index} className="flex gap-3.5">
                    <LineThumb swatch={l.product.swatch} width={72} />
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                      <Link href={routes.product(l.slug)} onClick={close} className="text-body font-medium text-ink no-underline">
                        {l.product.name}
                      </Link>
                      <span className="text-caption text-ink-2">{l.meta}</span>
                      <span className="price text-body">{formatPKR(l.linePaisa)}</span>
                    </div>
                  </div>
                ))}
          </div>
          <div className="flex flex-none flex-col gap-1.5 border-t border-line p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-body font-medium">Subtotal</span>
              <span className="price text-group">{formatPKR(subtotalPaisa)}</span>
            </div>
            <p className="m-0 text-caption text-ink-2">Shipping calculated at checkout</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <ButtonLink variant="secondary" href={routes.cart} onClick={close}>
                View cart
              </ButtonLink>
              <ButtonLink href={routes.checkout} onClick={close}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}

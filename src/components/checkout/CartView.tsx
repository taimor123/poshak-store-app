'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { routes } from '@/config/routes';
import { formatPKR } from '@/lib/format';
import { swatchFor } from '@/lib/catalog/product';
import { refreshCart, useCart } from '@/stores/cart';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { TotalRow } from '@/components/commerce/Price';
import { LineThumb } from '@/components/commerce/ProductImage';
import { lineNotice, useCartLineActions } from '@/components/commerce/CartLineActions';

/**
 * Cart: lines + summary. Re-reads the server cart on every visit (current
 * price wins, quantities clamp to stock). Shipping here is an estimate — the
 * fee is final once the city is chosen at checkout.
 */
export function CartView({ freeShippingThresholdPaisa, standardFeePaisa }: { freeShippingThresholdPaisa: number; standardFeePaisa: number }) {
  const { cart, loaded } = useCart();
  const { busy, setQty, remove } = useCartLineActions();
  useEffect(() => {
    void refreshCart();
  }, []);

  const shipping = cart.subtotalPaisa >= freeShippingThresholdPaisa ? 0 : standardFeePaisa;
  const gap = freeShippingThresholdPaisa - cart.subtotalPaisa;

  return (
    <div className="wrap pt-7">
      <h1 className="h-page m-0">Your cart</h1>
      <section aria-label="Cart items" aria-busy={!loaded} className="mt-6">
        {!loaded ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12" aria-hidden="true">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[162px] rounded-card" />
              <Skeleton className="h-[162px] rounded-card" />
            </div>
            <Skeleton className="h-[300px] rounded-card" />
          </div>
        ) : cart.lines.length === 0 ? (
          <EmptyState title="Your cart is empty" body="Nothing here yet. This week’s arrivals are a good place to start." action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>} />
        ) : (
          <div className="grid animate-fadein gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <div className="flex flex-col border-t border-line">
              {cart.lines.map((l) => {
                const notice = lineNotice(l);
                const ok = l.status === 'ok';
                return (
                  <div key={l.id} className="flex gap-4 border-b border-line py-5" aria-busy={busy === l.id}>
                    <Link href={routes.product(l.product.slug)} tabIndex={-1} aria-hidden="true" className={ok ? '' : 'opacity-50'}>
                      <LineThumb swatch={swatchFor(l.product.colour)} image={l.product.image} width={96} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={routes.product(l.product.slug)} className={`text-body font-medium text-ink no-underline ${ok ? '' : 'line-through'}`}>
                          {l.product.name}
                        </Link>
                        <span className="price text-body whitespace-nowrap">{ok ? formatPKR(l.linePaisa) : '—'}</span>
                      </div>
                      <span className="text-caption text-ink-2">
                        {l.size ? `Size ${l.size}` : 'Unstitched'} · {formatPKR(l.unitPricePaisa)} each
                      </span>
                      {notice && <span className={`text-caption font-medium ${ok && !l.notices.includes('price_up') ? 'text-success' : 'text-warning'}`}>{notice}</span>}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                        {ok ? (
                          <QtyStepper label={`Quantity for ${l.product.name}`} qty={l.qty} max={Math.min(cart.maxQtyPerLine, l.available)} onChange={(n) => void setQty(l, n)} />
                        ) : (
                          <span />
                        )}
                        <button type="button" className="tlink text-ui font-medium text-ink-2" disabled={busy === l.id} onClick={() => void remove(l)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link href={routes.category('new')} className="tlink mt-3">
                ← Continue shopping
              </Link>
            </div>
            <aside aria-label="Order summary" className="card-box flex flex-col gap-3 p-5 lg:sticky lg:top-[88px]">
              <h2 className="m-0 text-group font-semibold">Order summary</h2>
              <div className="text-body">
                <TotalRow label="Subtotal" value={formatPKR(cart.subtotalPaisa)} />
              </div>
              <div className="text-body">
                <TotalRow label="Estimated shipping" value={shipping ? formatPKR(shipping) : 'Free'} />
              </div>
              <p className={`m-0 text-caption ${gap > 0 ? 'text-ink-2' : 'text-success'}`}>{gap > 0 ? `Add ${formatPKR(gap)} more for free shipping.` : 'Your order ships free.'}</p>
              <div className="border-t border-line pt-3 text-body">
                <TotalRow strong label="Total" value={formatPKR(cart.subtotalPaisa + shipping)} />
              </div>
              {cart.canCheckout ? (
                <ButtonLink href={routes.checkout} className="mt-1">
                  Checkout
                </ButtonLink>
              ) : (
                <button type="button" className="btn-primary mt-1" disabled>
                  Remove unavailable items to check out
                </button>
              )}
              <p className="m-0 text-center text-caption text-ink-2">Cash on delivery. Pay the rider when your order arrives.</p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

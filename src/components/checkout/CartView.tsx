'use client';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { storeConfig } from '@/config/store';
import { useCartDetails } from '@/hooks/useCartDetails';
import { formatPKR } from '@/lib/format';
import { shippingFor } from '@/lib/shipping';
import { useCart } from '@/stores/cart';
import { toast } from '@/stores/ui';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { TotalRow } from '@/components/commerce/Price';
import { swatchVar } from '@/lib/catalog/product';

/** Cart: lines + summary. Re-fetches product data on every view (current price wins). */
export function CartView() {
  const { lines, count, subtotalPaisa, loading } = useCartDetails({ fresh: true });
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const shipping = shippingFor(subtotalPaisa, 'standard');
  const gap = storeConfig.freeShippingMinPaisa - subtotalPaisa;

  return (
    <div className="wrap pt-7">
      <h1 className="h-page m-0">Your cart</h1>
      <section aria-label="Cart items" aria-busy={loading} className="mt-6">
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12" aria-hidden="true">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[162px] rounded-card" />
              <Skeleton className="h-[162px] rounded-card" />
            </div>
            <Skeleton className="h-[300px] rounded-card" />
          </div>
        ) : count === 0 ? (
          <EmptyState title="Your cart is empty" body="Nothing here yet. This week’s arrivals are a good place to start." action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>} />
        ) : (
          <div className="grid animate-fadein gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <div className="flex flex-col border-t border-line">
              {lines.map((l) => (
                <div key={l.index} className="flex gap-4 border-b border-line py-5">
                  <Link href={routes.product(l.slug)} tabIndex={-1} aria-hidden="true" className="w-24 flex-none rounded-card" style={{ aspectRatio: '3/4', background: swatchVar(l.product.swatch) }} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={routes.product(l.slug)} className="text-body font-medium text-ink no-underline">
                        {l.product.name}
                      </Link>
                      <span className="price text-body whitespace-nowrap">{formatPKR(l.linePaisa)}</span>
                    </div>
                    <span className="text-caption text-ink-2">
                      {l.size ? `Size ${l.size}` : 'Unstitched'} · {formatPKR(l.product.pricePaisa)} each
                    </span>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                      <QtyStepper label={`Quantity for ${l.product.name}`} qty={l.qty} max={storeConfig.maxQtyPerLine} onChange={(n) => setQty(l.index, n)} />
                      <button
                        type="button"
                        className="tlink text-ui font-medium text-ink-2"
                        onClick={() => {
                          remove(l.index);
                          toast('Removed from your cart');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <Link href={routes.category('new')} className="tlink mt-3">
                ← Continue shopping
              </Link>
            </div>
            <aside aria-label="Order summary" className="card-box flex flex-col gap-3 p-5 lg:sticky lg:top-[88px]">
              <h2 className="m-0 text-group font-semibold">Order summary</h2>
              <div className="text-body">
                <TotalRow label="Subtotal" value={formatPKR(subtotalPaisa)} />
              </div>
              <div className="text-body">
                <TotalRow label="Standard shipping" value={shipping ? formatPKR(shipping) : 'Free'} />
              </div>
              <p className={`m-0 text-caption ${gap > 0 ? 'text-ink-2' : 'text-success'}`}>{gap > 0 ? `Add ${formatPKR(gap)} more for free shipping.` : 'Your order ships free.'}</p>
              <div className="border-t border-line pt-3 text-body">
                <TotalRow strong label="Total" value={formatPKR(subtotalPaisa + shipping)} />
              </div>
              <ButtonLink href={routes.checkout} className="mt-1">
                Checkout
              </ButtonLink>
              <p className="m-0 text-center text-caption text-ink-2">Cash on delivery. Pay the rider when your order arrives.</p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

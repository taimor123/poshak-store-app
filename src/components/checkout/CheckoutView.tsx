'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { storeConfig } from '@/config/store';
import { useCartDetails } from '@/hooks/useCartDetails';
import { placeOrder } from '@/lib/actions/orders';
import { formatPKR, plural } from '@/lib/format';
import { isExpressCity, shippingFor, type DeliveryMethod } from '@/lib/shipping';
import { useCart } from '@/stores/cart';
import { useShopper } from '@/stores/shopper';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { Skeleton } from '@/components/ui/Skeleton';
import { SummaryCard, SummaryLines, Totals } from '@/components/commerce/OrderSummary';
import { AddressSection, DeliverySection, EMPTY_ADDRESS, PaymentSection, ReviewSection, StepProgress, validateAddress, type AddressFields } from './CheckoutSections';

const DRAFT_KEY = `${siteConfig.storageKey}.checkout`;

/**
 * COD-first checkout. `single` = one page; `steps` = Address → Delivery &
 * payment → Review. The server re-prices the order; totals here are a preview.
 */
export function CheckoutView({ layout = 'single' }: { layout?: 'single' | 'steps' }) {
  const router = useRouter();
  const { lines, count, subtotalPaisa, loading } = useCartDetails({ fresh: true });
  const cartLines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);
  const saveOrder = useShopper((s) => s.saveOrder);
  const [placing, startPlacing] = useTransition();

  const single = layout === 'single';
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<AddressFields>(readDraft);
  const [method, setMethod] = useState<DeliveryMethod>('standard');
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState('');
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(address));
    } catch {}
  }, [address]);

  const effectiveMethod: DeliveryMethod = method === 'express' && !isExpressCity(address.city) ? 'standard' : method;
  const shippingPaisa = shippingFor(subtotalPaisa, effectiveMethod);
  const totalPaisa = subtotalPaisa + shippingPaisa;
  const errors = tried ? validateAddress(address) : {};

  const focusFirstInvalid = () => {
    setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 30);
  };

  const place = () =>
    startPlacing(async () => {
      setServerError('');
      const res = await placeOrder({ ...address, method: effectiveMethod, lines: cartLines });
      if (!res.ok) return setServerError(res.error.message);
      saveOrder(res.data);
      clearCart();
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}
      router.push(routes.confirmation);
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (single || step === 1) {
      if (Object.keys(validateAddress(address)).length) {
        setTried(true);
        setStep(1);
        return focusFirstInvalid();
      }
    }
    if (!single && step < 3) {
      setStep(step + 1);
      setTried(true);
      window.scrollTo({ top: 0 });
      return;
    }
    place();
  };

  const showAddress = single || step === 1;
  const showDelivery = single || step === 2;
  const showReview = !single && step === 3;

  return (
    <div className="wrap pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="h-page m-0">Checkout</h1>
        <Link href={routes.cart} className="tlink text-ui">
          ← Back to cart
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12" aria-busy="true">
          <Skeleton className="h-[420px] rounded-card" />
          <Skeleton className="h-[260px] rounded-card" />
        </div>
      ) : count === 0 ? (
        <EmptyState className="mt-6 py-10" title="Your cart is empty" action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>} />
      ) : (
        <>
          {!single && <StepProgress step={step} />}
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <form onSubmit={submit} noValidate className="order-1 flex flex-col gap-7">
              {showAddress && <AddressSection value={address} errors={errors} onChange={setAddress} />}
              {showDelivery && (
                <>
                  <DeliverySection method={effectiveMethod} city={address.city} subtotalPaisa={subtotalPaisa} onChange={setMethod} />
                  <PaymentSection totalPaisa={totalPaisa} />
                </>
              )}
              {showReview && <ReviewSection address={address} method={effectiveMethod} onEdit={setStep} />}
              <div className="flex flex-col gap-2.5">
                {serverError && (
                  <p role="alert" className="m-0 text-ui font-medium text-sale">
                    {serverError}
                  </p>
                )}
                <div className="flex gap-2.5">
                  {!single && step > 1 && (
                    <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                      Back
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1" disabled={placing}>
                    {placing ? 'Placing your order…' : single || step === 3 ? `Place order · ${formatPKR(totalPaisa)}` : 'Continue'}
                  </button>
                </div>
                <p className="m-0 text-caption text-ink-2">
                  We’ll confirm your order on WhatsApp before it’s dispatched. {storeConfig.returnWindowDays}-day easy returns.
                </p>
              </div>
            </form>

            <SummaryCard title={`Order summary · ${plural(count, 'item')}`} className="order-first lg:sticky lg:top-[88px] lg:order-last">
              <SummaryLines lines={lines.map((l) => ({ key: l.index, name: l.product.name, meta: l.meta, swatch: l.product.swatch, linePaisa: l.linePaisa }))} />
              <Totals subtotalPaisa={subtotalPaisa} shippingPaisa={shippingPaisa} totalLabel="Total to pay on delivery" />
            </SummaryCard>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Restores the address draft so a refresh doesn't lose it (CHECKOUT_FLOW.md).
 * The form only renders after the cart has loaded on the client, so reading
 * sessionStorage here can't cause a hydration mismatch.
 */
function readDraft(): AddressFields {
  if (typeof window === 'undefined') return EMPTY_ADDRESS;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_ADDRESS, ...JSON.parse(raw) } : EMPTY_ADDRESS;
  } catch {
    return EMPTY_ADDRESS;
  }
}

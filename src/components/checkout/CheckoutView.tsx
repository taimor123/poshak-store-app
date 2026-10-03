'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { placeOrder } from '@/lib/actions/orders';
import { formatPKR, plural } from '@/lib/format';
import { swatchFor } from '@/lib/catalog/product';
import type { ShippingZone } from '@/lib/catalog/types';
import { refreshCart, useCart } from '@/stores/cart';
import { useShopper } from '@/stores/shopper';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { Skeleton } from '@/components/ui/Skeleton';
import { SummaryCard, SummaryLines, Totals } from '@/components/commerce/OrderSummary';
import {
  API_FIELD,
  AddressSection,
  DeliverySection,
  EMPTY_ADDRESS,
  PaymentSection,
  ReviewSection,
  StepProgress,
  validateAddress,
  type AddressErrors,
  type AddressFields,
  type DeliveryMethod,
} from './CheckoutSections';

const DRAFT_KEY = `${siteConfig.storageKey}.checkout`;
const KEY_KEY = `${siteConfig.storageKey}.checkout.key`;

type Props = { layout: 'single' | 'steps'; zones: ShippingZone[]; freeShippingThresholdPaisa: number; expressFeePaisa: number; returnWindowDays: number };

/**
 * COD-first checkout over the server cart. The API prices the order; the total
 * shown here is echoed back and must match (PRICE_MISMATCH otherwise).
 */
export function CheckoutView({ layout, zones, freeShippingThresholdPaisa, expressFeePaisa, returnWindowDays }: Props) {
  const router = useRouter();
  const { cart, loaded } = useCart();
  const user = useShopper((s) => s.user);
  const [placing, startPlacing] = useTransition();

  const single = layout === 'single';
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<AddressFields>(readDraft);
  const [method, setMethod] = useState<DeliveryMethod>('STANDARD');
  const [tried, setTried] = useState(false);
  const [apiErrors, setApiErrors] = useState<AddressErrors>({});
  const [banner, setBanner] = useState('');

  useEffect(() => {
    void refreshCart();
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(address));
    } catch {}
  }, [address]);

  // Signed-in shoppers: pre-fill name and email (fields they've typed win).
  const form: AddressFields = user ? { ...address, name: address.name || user.name, email: address.email || user.email } : address;

  const zone = zones.find((z) => z.city === form.city);
  const effectiveMethod: DeliveryMethod = method === 'EXPRESS' && !zone?.expressAvailable ? 'STANDARD' : method;
  const standardFeePaisa = cart.subtotalPaisa >= freeShippingThresholdPaisa ? 0 : (zone?.feePaisa ?? zones[0]?.feePaisa ?? 0);
  const shippingPaisa = effectiveMethod === 'EXPRESS' ? expressFeePaisa : standardFeePaisa;
  const totalPaisa = cart.subtotalPaisa + shippingPaisa;
  const errors = { ...(tried ? validateAddress(form) : {}), ...apiErrors };

  const focusFirstInvalid = () => {
    setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 30);
  };

  const place = () =>
    startPlacing(async () => {
      setBanner('');
      setApiErrors({});
      const res = await placeOrder(
        {
          contact: { email: form.email.trim(), phone: form.phone.trim() },
          address: { name: form.name.trim(), line1: form.address.trim(), city: form.city, ...(form.notes.trim() && { notes: form.notes.trim() }) },
          deliveryMethod: effectiveMethod,
          clientTotalPaisa: totalPaisa,
        },
        idempotencyKey(),
      );
      if (res.ok) {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
          sessionStorage.removeItem(KEY_KEY);
        } catch {}
        const q = new URLSearchParams({ o: res.data.orderNo, ...(res.data.guestToken && { t: res.data.guestToken }) });
        router.push(`${routes.confirmation}?${q}`);
        void refreshCart();
        return;
      }
      const { code, message, fieldErrors } = res.error;
      if (code === 'PRICE_MISMATCH' || code === 'STOCK_CONFLICT' || code === 'VARIANT_GONE') {
        await refreshCart();
        resetIdempotencyKey(); // the order changed — the next attempt is a new order
        setBanner(
          code === 'PRICE_MISMATCH'
            ? 'Prices changed since you opened checkout. Please check the new total and place your order again.'
            : 'Some items just sold out or changed. We’ve updated your cart — please review it.',
        );
      } else if (code === 'VALIDATION' && fieldErrors) {
        const mapped: AddressErrors = {};
        for (const [k, v] of Object.entries(fieldErrors)) if (API_FIELD[k]) mapped[API_FIELD[k]] = v;
        setApiErrors(mapped);
        setBanner(Object.keys(mapped).length ? '' : message);
        setStep(1);
        focusFirstInvalid();
      } else setBanner(message);
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors({});
    if (single || step === 1) {
      if (Object.keys(validateAddress(form)).length) {
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
  const okLines = cart.lines.filter((l) => l.status === 'ok');

  return (
    <div className="wrap pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="h-page m-0">Checkout</h1>
        <Link href={routes.cart} className="tlink text-ui">
          ← Back to cart
        </Link>
      </div>

      {!loaded ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12" aria-busy="true">
          <Skeleton className="h-[420px] rounded-card" />
          <Skeleton className="h-[260px] rounded-card" />
        </div>
      ) : okLines.length === 0 ? (
        <EmptyState className="mt-6 py-10" title="Your cart is empty" action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>} />
      ) : !cart.canCheckout ? (
        <EmptyState className="mt-6 py-10" title="Some items need your attention" body="A piece in your cart sold out or is no longer available." action={<ButtonLink href={routes.cart}>Review your cart</ButtonLink>} />
      ) : (
        <>
          {!single && <StepProgress step={step} />}
          {banner && (
            <p role="alert" className="mt-5 mb-0 rounded-card border border-warning bg-surface px-4 py-3 text-ui font-medium text-ink">
              {banner}
            </p>
          )}
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <form onSubmit={submit} noValidate className="order-1 flex flex-col gap-7">
              {showAddress && <AddressSection value={form} errors={errors} cities={zones.map((z) => z.city)} onChange={setAddress} />}
              {showDelivery && (
                <>
                  <DeliverySection method={effectiveMethod} zone={zone} standardFeePaisa={standardFeePaisa} expressFeePaisa={expressFeePaisa} onChange={setMethod} />
                  <PaymentSection totalPaisa={totalPaisa} />
                </>
              )}
              {showReview && <ReviewSection address={form} method={effectiveMethod} estimate={zone?.estimateText ?? ''} onEdit={setStep} />}
              <div className="flex flex-col gap-2.5">
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
                <p className="m-0 text-caption text-ink-2">We’ll confirm your order on WhatsApp before it’s dispatched. {returnWindowDays}-day easy returns.</p>
              </div>
            </form>

            <SummaryCard title={`Order summary · ${plural(cart.count, 'item')}`} className="order-first lg:sticky lg:top-[88px] lg:order-last">
              <SummaryLines
                lines={okLines.map((l) => ({ key: l.id, name: l.product.name, meta: `${l.size ? 'Size ' + l.size : 'Unstitched'} · Qty ${l.qty}`, swatch: swatchFor(l.product.colour), image: l.product.image, linePaisa: l.linePaisa }))}
              />
              <Totals subtotalPaisa={cart.subtotalPaisa} shippingPaisa={shippingPaisa} totalLabel="Total to pay on delivery" />
            </SummaryCard>
          </div>
        </>
      )}
    </div>
  );
}

/** Restores the address draft (CHECKOUT_FLOW.md §Abandonment). The form renders only after the cart loads, so no hydration mismatch. */
function readDraft(): AddressFields {
  if (typeof window === 'undefined') return EMPTY_ADDRESS;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_ADDRESS, ...JSON.parse(raw) } : EMPTY_ADDRESS;
  } catch {
    return EMPTY_ADDRESS;
  }
}

/** One key per checkout attempt: a retry after a network error can never create a second order. */
function idempotencyKey(): string {
  try {
    const existing = sessionStorage.getItem(KEY_KEY);
    if (existing) return existing;
    const k = crypto.randomUUID();
    sessionStorage.setItem(KEY_KEY, k);
    return k;
  } catch {
    return crypto.randomUUID();
  }
}

function resetIdempotencyKey() {
  try {
    sessionStorage.removeItem(KEY_KEY);
  } catch {}
}

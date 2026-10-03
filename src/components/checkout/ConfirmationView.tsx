'use client';
import { routes } from '@/config/routes';
import { formatPKR } from '@/lib/format';
import { deliveryLabel } from '@/lib/shipping';
import { useShopper } from '@/stores/shopper';
import { useUi } from '@/stores/ui';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState, NumberedSteps } from '@/components/ui/Blocks';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckIcon } from '@/components/ui/icons';
import { SummaryLines, Totals } from '@/components/commerce/OrderSummary';

const card = 'card-box flex flex-col gap-1 p-5 text-body';
const cap = 'mb-2 mt-0 text-label font-semibold uppercase text-ink-2';

/** Order placed: what happens next, address, ETA, items and the cash to keep ready. */
export function ConfirmationView() {
  const hydrated = useUi((s) => s.hydrated);
  const o = useShopper((s) => s.lastOrder);

  if (!hydrated)
    return (
      <div className="wrap pt-10" aria-busy="true">
        <div className="mx-auto flex max-w-[720px] flex-col gap-4">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-[34px] w-[80%] rounded-btn" />
          <Skeleton className="h-[260px] rounded-card" />
        </div>
      </div>
    );

  if (!o)
    return (
      <div className="wrap pt-10">
        <h1 className="sr-only">Order confirmation</h1>
        <EmptyState className="mx-auto max-w-[720px]" title="No recent order on this device" body="If you placed an order, you can track it with your order number and mobile." action={<ButtonLink href={routes.account('track')}>Track an order</ButtonLink>} />
      </div>
    );

  const next = [
    { title: 'We confirm on WhatsApp', body: 'Within 12 hours. Reply to change your size or address.' },
    { title: 'We pack and dispatch', body: 'Within 1 working day of confirmation. You’ll get the tracking number by SMS.' },
    { title: 'The rider delivers', body: `Expected ${o.eta}. They’ll call before arriving.` },
    { title: 'Pay in cash', body: `${formatPKR(o.totalPaisa)}. Riders may not carry change.` },
  ];

  return (
    <div className="wrap pt-10">
      <div className="mx-auto flex max-w-[720px] flex-col gap-7">
        <div className="flex flex-col gap-3">
          <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-success text-surface">
            <CheckIcon />
          </span>
          <p className="eyebrow m-0 text-ink-2">Order {o.orderNo}</p>
          <h1 className="h-page m-0">Shukriya, {o.name.split(' ')[0]}! Your order is placed.</h1>
          <p className="m-0 text-[15px] leading-6 text-ink-2">
            We’ll confirm it on WhatsApp at {o.phone} within 12 hours. Please keep <strong className="font-semibold text-ink">{formatPKR(o.totalPaisa)}</strong> ready in cash for the rider.
          </p>
        </div>
        <section aria-labelledby="next-h" className="card-box p-5">
          <h2 id="next-h" className="mt-0 mb-4 text-group font-semibold">
            What happens next
          </h2>
          <NumberedSteps steps={next} className="gap-4" />
        </section>
        <div className="grid gap-4 sm:grid-cols-2">
          <section aria-labelledby="to-h" className={card}>
            <h2 id="to-h" className={cap}>
              Delivering to
            </h2>
            <span className="font-semibold">{o.name}</span>
            <span>{[o.address, o.landmark, o.city].filter(Boolean).join(', ')}</span>
            <span className="text-ink-2">{o.phone}</span>
          </section>
          <section aria-labelledby="dl-h" className={card}>
            <h2 id="dl-h" className={cap}>
              Delivery
            </h2>
            <span className="font-semibold">{deliveryLabel(o.method)}</span>
            <span>Expected {o.eta}</span>
            <span className="text-ink-2">Cash on delivery</span>
          </section>
        </div>
        <section aria-labelledby="it-h" className="card-box flex flex-col gap-3.5 p-5">
          <h2 id="it-h" className="m-0 text-group font-semibold">
            Items
          </h2>
          <SummaryLines lines={o.lines.map((l, i) => ({ key: i, ...l }))} />
          <Totals subtotalPaisa={o.subtotalPaisa} shippingPaisa={o.shippingPaisa} totalLabel="Pay on delivery" divided={false} />
        </section>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href={routes.account()}>Track your order</ButtonLink>
          <ButtonLink variant="secondary" href={routes.category('new')}>
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

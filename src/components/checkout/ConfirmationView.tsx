import { routes } from '@/config/routes';
import { deliveryRange, formatPKR } from '@/lib/format';
import { swatchFor } from '@/lib/catalog/product';
import { formatPkPhone } from '@/lib/validation';
import type { OrderView } from '@/lib/orders/types';
import { ButtonLink } from '@/components/ui/Button';
import { NumberedSteps } from '@/components/ui/Blocks';
import { CheckIcon } from '@/components/ui/icons';
import { SummaryLines, Totals } from '@/components/commerce/OrderSummary';

const card = 'card-box flex flex-col gap-1 p-5 text-body';
const cap = 'mb-2 mt-0 text-label font-semibold uppercase text-ink-2';

/** Order placed: what happens next, address, ETA, items and the cash to keep ready. */
export function ConfirmationView({ order: o, trackHref }: { order: OrderView; trackHref: string }) {
  const total = formatPKR(o.amounts.totalPaisa);
  const eta = deliveryRange([2, 5]);
  const next = [
    { title: 'We confirm on WhatsApp', body: 'Within 12 hours. Reply to change your size or address.' },
    { title: 'We pack and dispatch', body: 'Within 1 working day of confirmation. You’ll get the tracking number by SMS.' },
    { title: 'The rider delivers', body: `Expected ${eta}. They’ll call before arriving.` },
    { title: 'Pay in cash', body: `${total}. Riders may not carry change.` },
  ];

  return (
    <div className="wrap pt-10">
      <div className="mx-auto flex max-w-[720px] flex-col gap-7">
        <div className="flex flex-col gap-3">
          <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-success text-surface">
            <CheckIcon />
          </span>
          <p className="eyebrow m-0 text-ink-2">Order {o.orderNo}</p>
          <h1 className="h-page m-0">Shukriya, {o.shipping.name.split(' ')[0]}! Your order is placed.</h1>
          <p className="m-0 text-[15px] leading-6 text-ink-2">
            We’ll confirm it on WhatsApp at {formatPkPhone(o.contact.phone)} within 12 hours, and we’ve emailed your receipt to {o.contact.email}. Please keep{' '}
            <strong className="font-semibold text-ink">{total}</strong> ready in cash for the rider.
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
            <span className="font-semibold">{o.shipping.name}</span>
            <span>{[o.shipping.line1, o.shipping.notes, o.shipping.city].filter(Boolean).join(', ')}</span>
            <span className="text-ink-2">{formatPkPhone(o.shipping.phone)}</span>
          </section>
          <section aria-labelledby="dl-h" className={card}>
            <h2 id="dl-h" className={cap}>
              Delivery
            </h2>
            <span className="font-semibold">{o.amounts.shippingPaisa === 0 ? 'Free delivery' : `Delivery · ${formatPKR(o.amounts.shippingPaisa)}`}</span>
            <span>Expected {eta}</span>
            <span className="text-ink-2">Cash on delivery</span>
          </section>
        </div>
        <section aria-labelledby="it-h" className="card-box flex flex-col gap-3.5 p-5">
          <h2 id="it-h" className="m-0 text-group font-semibold">
            Items
          </h2>
          <SummaryLines
            lines={o.items.map((i) => ({
              key: i.id,
              name: i.productName,
              meta: `${i.sizeLabel ? 'Size ' + i.sizeLabel : 'Unstitched'} · Qty ${i.qty}`,
              swatch: swatchFor(i.productName),
              image: i.imageUrl ? { url: i.imageUrl } : null,
              linePaisa: i.linePaisa,
            }))}
          />
          <Totals subtotalPaisa={o.amounts.subtotalPaisa} shippingPaisa={o.amounts.shippingPaisa} totalLabel="Pay on delivery" divided={false} />
        </section>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href={trackHref}>Track your order</ButtonLink>
          <ButtonLink variant="secondary" href={routes.category('new')}>
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

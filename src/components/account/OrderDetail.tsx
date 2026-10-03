'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cancelOrder } from '@/lib/actions/orders';
import { whatsappHref } from '@/lib/contact';
import { formatPKR } from '@/lib/format';
import { swatchFor } from '@/lib/catalog/product';
import { DELIVERED_STEP, STATUS_LABEL, stepDates, trackingStep, type OrderView } from '@/lib/orders/types';
import { toast } from '@/stores/ui';
import { Pill } from '@/components/ui/Blocks';
import { SelectField } from '@/components/ui/Field';
import { SummaryLines, Totals } from '@/components/commerce/OrderSummary';
import { TrackingTimeline } from '@/components/commerce/TrackingTimeline';

const CANCEL_REASONS = ['Changed my mind', 'Ordered the wrong size', 'Found a better price', 'Delivery is too slow', 'Other'];

/** Order tracking page body: status, timeline, items, and self-serve cancel while still allowed. */
export function OrderDetail({ order: o, token }: { order: OrderView; token?: string }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const step = trackingStep(o.status);

  const confirmCancel = () =>
    start(async () => {
      if (!reason) return setError('Choose a reason.');
      const r = await cancelOrder(o.orderNo, reason, token);
      if (!r.ok) return setError(r.error.message);
      toast('Your order has been cancelled');
      setCancelling(false);
      router.refresh();
    });

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow m-0 text-ink-2">Order {o.orderNo}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="h-page m-0">{STATUS_LABEL[o.status]}</h1>
          <Pill tone={step === DELIVERED_STEP ? 'success' : 'brand'} dot>
            {formatPKR(o.amounts.totalPaisa)} · Cash on delivery
          </Pill>
        </div>
        {o.cancelReason && <p className="m-0 text-body text-ink-2">Cancelled: {o.cancelReason}</p>}
      </div>

      {step >= 0 && (
        <section aria-label="Tracking" className="card-box flex flex-col gap-3.5 p-5">
          {o.trackingNo && (
            <p className="m-0 text-ui text-ink-2">
              {o.courier} tracking <strong className="font-semibold text-ink tabular-nums">{o.trackingNo}</strong>
            </p>
          )}
          <TrackingTimeline step={step} dates={stepDates(o)} />
        </section>
      )}

      <section aria-labelledby="items-h" className="card-box flex flex-col gap-3.5 p-5">
        <h2 id="items-h" className="m-0 text-group font-semibold">
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

      <section aria-labelledby="to-h" className="card-box flex flex-col gap-1 p-5 text-body">
        <h2 id="to-h" className="mt-0 mb-2 text-label font-semibold text-ink-2 uppercase">
          Delivering to
        </h2>
        <span className="font-semibold">{o.shipping.name}</span>
        <span>{[o.shipping.line1, o.shipping.notes, o.shipping.city].filter(Boolean).join(', ')}</span>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <a className="btn-secondary" href={whatsappHref(`Hi! I need help with order ${o.orderNo}.`)} target="_blank" rel="noopener noreferrer">
          Help on WhatsApp
        </a>
        {o.canCancel && !cancelling && (
          <button type="button" className="tlink text-ui text-ink-2" onClick={() => setCancelling(true)}>
            Cancel this order
          </button>
        )}
      </div>

      {cancelling && (
        <section aria-label="Cancel order" className="card-box flex flex-col gap-3 p-5">
          <SelectField id="cancel-reason" label="Why are you cancelling?" placeholder="Choose a reason" options={CANCEL_REASONS} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} error={error} />
          <div className="flex gap-2.5">
            <button type="button" className="btn-primary" disabled={pending} onClick={confirmCancel}>
              {pending ? 'Cancelling…' : 'Cancel order'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setCancelling(false)}>
              Keep my order
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

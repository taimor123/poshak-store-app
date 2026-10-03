'use client';
import { whatsappHref } from '@/lib/contact';
import { formatPKR, plural } from '@/lib/format';
import { DELIVERED_STEP, statusLabel, type OrderSummary } from '@/lib/orders/types';
import { Pill } from '@/components/ui/Blocks';
import { TrackingTimeline } from '@/components/commerce/TrackingTimeline';

/** One order with status pill and an expandable tracking timeline. */
export function OrderCard({ order: o, open, onToggle }: { order: OrderSummary; open: boolean; onToggle: () => void }) {
  const done = o.step === DELIVERED_STEP;
  return (
    <article className="card-box">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-[18px]">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 text-body font-semibold">{o.orderNo}</h2>
            <Pill tone={done ? 'success' : 'brand'} dot>
              {statusLabel(o.step)}
            </Pill>
          </div>
          <span className="text-ui text-ink-2">
            Placed {o.placedOn} · {plural(o.itemCount, 'item')} · {formatPKR(o.totalPaisa)}
          </span>
          <span className="text-ui">{o.summary}</span>
        </div>
        <button type="button" className="btn-secondary min-h-11 px-4" aria-expanded={open} onClick={onToggle}>
          {open ? 'Hide tracking' : done ? 'View details' : 'Track'}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-3.5 border-t border-line px-5 py-[18px]">
          {o.tracking && (
            <p className="m-0 text-ui text-ink-2">
              {o.courier} tracking <strong className="font-semibold text-ink tabular-nums">{o.tracking}</strong>
            </p>
          )}
          <TrackingTimeline step={o.step} dates={o.stepDates} />
          <a className="tlink self-start text-ui" href={whatsappHref(`Hi! I need help with order ${o.orderNo}.`)} target="_blank" rel="noopener noreferrer">
            Need help with this order? WhatsApp us
          </a>
        </div>
      )}
    </article>
  );
}

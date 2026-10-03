'use client';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { whatsappHref } from '@/lib/contact';
import { formatPKR, plural } from '@/lib/format';
import { DELIVERED_STEP, STATUS_LABEL, stepDates, trackingStep, type OrderView } from '@/lib/orders/types';
import { Pill } from '@/components/ui/Blocks';
import { TrackingTimeline } from '@/components/commerce/TrackingTimeline';

const placedOn = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Karachi' });

/** One order with status pill and an expandable tracking timeline. */
export function OrderCard({ order: o, open, onToggle }: { order: OrderView; open: boolean; onToggle: () => void }) {
  const step = trackingStep(o.status);
  const done = step === DELIVERED_STEP;
  const cancelled = step < 0;
  const count = o.items.reduce((a, i) => a + i.qty, 0);
  return (
    <article className="card-box">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-[18px]">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 text-body font-semibold">
              <Link href={routes.order(o.orderNo)} className="text-ink no-underline hover:underline">
                {o.orderNo}
              </Link>
            </h2>
            <Pill tone={done ? 'success' : 'brand'} dot>
              {STATUS_LABEL[o.status]}
            </Pill>
          </div>
          <span className="text-ui text-ink-2">
            Placed {placedOn(o.placedAt)} · {plural(count, 'item')} · {formatPKR(o.amounts.totalPaisa)}
          </span>
          <span className="text-ui">{o.items.map((i) => i.productName.split(' — ')[0]).join(', ')}</span>
        </div>
        {!cancelled && (
          <button type="button" className="btn-secondary min-h-11 px-4" aria-expanded={open} onClick={onToggle}>
            {open ? 'Hide tracking' : done ? 'View details' : 'Track'}
          </button>
        )}
      </div>
      {open && !cancelled && (
        <div className="flex flex-col gap-3.5 border-t border-line px-5 py-[18px]">
          {o.trackingNo && (
            <p className="m-0 text-ui text-ink-2">
              {o.courier} tracking <strong className="font-semibold text-ink tabular-nums">{o.trackingNo}</strong>
            </p>
          )}
          <TrackingTimeline step={step} dates={stepDates(o)} />
          <a className="tlink self-start text-ui" href={whatsappHref(`Hi! I need help with order ${o.orderNo}.`)} target="_blank" rel="noopener noreferrer">
            Need help with this order? WhatsApp us
          </a>
        </div>
      )}
    </article>
  );
}

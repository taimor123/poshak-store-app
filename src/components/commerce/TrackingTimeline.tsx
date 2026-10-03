import { cn } from '@/lib/cn';
import { deliveryRange } from '@/lib/format';
import { DELIVERED_STEP, TRACKING_STEPS } from '@/lib/orders/types';

/** Vertical timeline: Placed → Confirmed → Dispatched → Out for delivery → Delivered. */
export function TrackingTimeline({ step, dates }: { step: number; dates: string[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {TRACKING_STEPS.map((label, k) => {
        const reached = k <= step;
        const current = k === step;
        const filled = reached && !(current && step < DELIVERED_STEP);
        return (
          <li key={label} className="grid grid-cols-[20px_1fr] gap-3">
            <span className="flex flex-col items-center">
              <span className={cn('mt-1 size-3.5 rounded-full border-2', reached ? 'border-brand' : 'border-mute', filled ? 'bg-brand' : 'bg-surface')} />
              <span className={cn('min-h-[18px] w-0.5 flex-1', k === DELIVERED_STEP ? 'bg-transparent' : k < step ? 'bg-brand' : 'bg-line')} />
            </span>
            <span className="flex flex-col pb-3">
              <span className={cn('text-body', current && 'font-semibold', reached ? 'text-ink' : 'text-ink-2')}>{label}</span>
              <span className="text-caption text-ink-2">{reached ? (dates[k] ?? '') : k === DELIVERED_STEP ? `Expected ${deliveryRange([1, 3])}` : ''}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

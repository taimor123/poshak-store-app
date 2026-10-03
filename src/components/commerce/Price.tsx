import { formatPKR } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Price with optional struck compare-at. Screen readers hear "Was / Now". */
export function Price({ paisa, compareAtPaisa, size = 'base' }: { paisa: number; compareAtPaisa?: number; size?: 'base' | 'lg' }) {
  const big = size === 'lg';
  const now = cn('price', big ? 'text-[22px] leading-7' : 'text-body');
  if (!compareAtPaisa) return <span className={now}>{formatPKR(paisa)}</span>;
  return (
    <span className="flex flex-wrap items-baseline gap-2 tabular-nums">
      <s className={cn('text-ink-2', big ? 'text-group' : 'text-body')}>
        <span className="sr-only">Was </span>
        {formatPKR(compareAtPaisa)}
      </s>
      <span className={cn(now, 'text-sale')}>
        <span className="sr-only">Now </span>
        {formatPKR(paisa)}
      </span>
    </span>
  );
}

/** Label / value row for order totals. */
export function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn('flex justify-between tabular-nums', strong && 'items-baseline')}>
      <span className={strong ? 'font-semibold' : undefined}>{label}</span>
      <span className={strong ? 'text-[20px] leading-7 font-semibold' : undefined}>{value}</span>
    </div>
  );
}

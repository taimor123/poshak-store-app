'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition, type ReactNode } from 'react';
import { routes } from '@/config/routes';
import { EMPTY_FILTERS, PRICE_BANDS, SORT_OPTIONS, toQuery, type ListingFilters, type SortKey } from '@/lib/catalog/filters';
import { SIZES } from '@/lib/catalog/sizes';
import type { Size } from '@/lib/catalog/types';
import { plural } from '@/lib/format';
import { useEscape, useFocusTrap, useLockScroll } from '@/hooks/a11y';
import { cn } from '@/lib/cn';
import { CheckRow } from '@/components/ui/Field';
import { CloseIcon, FilterIcon } from '@/components/ui/icons';

type Props = {
  basePath: string;
  filters: ListingFilters;
  subs: { key: string; label: string }[];
  fabricCounts: { fabric: string; count: number }[];
  hasStitched: boolean;
  resultCount: number;
  children: ReactNode;
};

const legend = 'mb-1.5 p-0 text-label font-semibold uppercase text-ink-2';
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

/**
 * Listing chrome: sub-category chips, toolbar (filters / count / sort), active
 * filter chips, and the filter panel (sidebar ≥1024, drawer below). Every
 * change rewrites the URL; the server re-renders the results passed as children.
 */
export function ListingControls({ basePath, filters: f, subs, fabricCounts, hasStitched, resultCount, children }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
  useFocusTrap(panel, open && isMobile);
  useLockScroll(open);
  useEscape(open, () => setOpen(false));

  const href = (next: Partial<ListingFilters>) => basePath + toQuery({ ...f, ...next });
  const go = (next: Partial<ListingFilters>) => startTransition(() => router.replace(href(next), { scroll: false }));
  const clearAll = () => go({ ...EMPTY_FILTERS, sort: f.sort });

  const subLabel = subs.find((s) => s.key === f.sub)?.label;
  const band = PRICE_BANDS.find((b) => b.key === f.price);
  const chips: { label: string; next: Partial<ListingFilters> }[] = [
    ...(f.sub && subLabel ? [{ label: subLabel, next: { sub: null } }] : []),
    ...f.fabrics.map((x) => ({ label: x, next: { fabrics: toggle(f.fabrics, x) } })),
    ...(band ? [{ label: band.label, next: { price: null } }] : []),
    ...f.sizes.map((z) => ({ label: `Size ${z}`, next: { sizes: toggle(f.sizes, z) } })),
    ...(f.onSale ? [{ label: 'On sale', next: { onSale: false } }] : []),
    ...(f.inStock ? [{ label: 'In stock', next: { inStock: false } }] : []),
  ];
  const nFilters = chips.length - (f.sub ? 1 : 0);
  const styles = plural(resultCount, 'style');

  return (
    <>
      {subs.length > 0 && (
        <div role="group" aria-label="Style" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 py-0.5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <Link href={href({ sub: null })} replace scroll={false} className="chip" data-on={!f.sub} aria-current={!f.sub ? 'true' : undefined}>
            All
          </Link>
          {subs.map((s) => (
            <Link key={s.key} href={href({ sub: s.key })} replace scroll={false} className="chip" data-on={f.sub === s.key} aria-current={f.sub === s.key ? 'true' : undefined}>
              {s.label}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-y border-line py-2">
        <div className="flex items-center gap-3">
          <button type="button" className="btn-secondary min-h-11 px-4 lg:hidden" aria-expanded={open} onClick={() => setOpen(true)}>
            <FilterIcon />
            Filters{nFilters ? ` (${nFilters})` : ''}
          </button>
          <span className="text-ui text-ink-2" aria-live="polite">
            {styles}
          </span>
        </div>
        <label className="flex items-center gap-2 text-ui text-ink-2">
          <span className="hidden min-[420px]:inline">Sort</span>
          <select
            aria-label="Sort"
            value={f.sort}
            onChange={(e) => go({ sort: e.target.value as SortKey })}
            className="min-h-11 max-w-[180px] cursor-pointer rounded-card border border-line-strong bg-surface px-2.5 text-ui font-medium text-ink"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chips.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button key={c.label} type="button" className="chip min-h-9 border-line bg-alt px-3" onClick={() => go(c.next)} aria-label={`Remove filter: ${c.label}`}>
              {c.label}
              <CloseIcon size={14} />
            </button>
          ))}
          <button type="button" className="tlink text-ui" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[232px_minmax(0,1fr)] lg:items-start lg:gap-10">
        {open && <div className="fixed inset-0 z-84 bg-scrim lg:hidden" aria-hidden="true" onClick={() => setOpen(false)} />}
        <aside
          ref={panel}
          aria-label="Filters"
          className={cn(
            'fixed inset-y-0 left-0 z-85 flex w-[min(340px,88vw)] flex-col overflow-y-auto bg-surface transition-transform duration-200',
            'lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:overflow-visible lg:bg-transparent',
            open ? 'translate-x-0 shadow-panel lg:shadow-none' : 'invisible -translate-x-full lg:visible',
          )}
        >
          <div className="flex items-center justify-between border-b border-line py-2.5 pr-2 pl-5 lg:hidden">
            <span className="text-group font-semibold">Filters</span>
            <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-6 px-5 pt-2 pb-5 lg:p-0">
            <fieldset className="m-0 border-0 p-0">
              <legend className={legend}>Fabric</legend>
              {fabricCounts.map(({ fabric, count }) => (
                <CheckRow
                  key={fabric}
                  type="checkbox"
                  label={fabric}
                  checked={f.fabrics.includes(fabric)}
                  onChange={() => go({ fabrics: toggle(f.fabrics, fabric) })}
                  trailing={<span className="text-caption text-ink-2 tabular-nums">{count}</span>}
                />
              ))}
            </fieldset>
            <fieldset className="m-0 border-0 p-0">
              <legend className={legend}>Price</legend>
              {PRICE_BANDS.map((b) => (
                <CheckRow key={b.key} type="radio" name="price" label={b.label} checked={f.price === b.key} onChange={() => go({ price: b.key })} />
              ))}
            </fieldset>
            {hasStitched && (
              <fieldset className="m-0 border-0 p-0">
                <legend className={cn(legend, 'mb-2.5')}>Size in stock</legend>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((z: Size) => (
                    <button key={z} type="button" className="size-chip" data-on={f.sizes.includes(z)} aria-pressed={f.sizes.includes(z)} onClick={() => go({ sizes: toggle(f.sizes, z) })}>
                      {z}
                    </button>
                  ))}
                </div>
                <Link href={routes.sizeGuide} className="tlink mt-1 text-ui">
                  Find your size →
                </Link>
              </fieldset>
            )}
            <fieldset className="m-0 border-0 p-0">
              <legend className={legend}>Availability</legend>
              <CheckRow type="checkbox" label="On sale" checked={f.onSale} onChange={() => go({ onSale: !f.onSale })} />
              <CheckRow type="checkbox" label="In stock only" checked={f.inStock} onChange={() => go({ inStock: !f.inStock })} />
            </fieldset>
          </div>
          <div className="sticky bottom-0 grid grid-cols-[1fr_1.4fr] gap-2.5 border-t border-line bg-surface px-5 py-4 lg:hidden">
            <button type="button" className="btn-secondary" onClick={clearAll}>
              Clear
            </button>
            <button type="button" className="btn-primary" onClick={() => setOpen(false)}>
              Show {styles}
            </button>
          </div>
        </aside>

        <section aria-label="Products" aria-busy={pending} className={cn('transition-opacity', pending && 'opacity-60')}>
          {children}
        </section>
      </div>
    </>
  );
}

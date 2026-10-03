import type { ReactNode } from 'react';
import { formatPKR } from '@/lib/format';
import type { Swatch } from '@/lib/catalog/types';
import { LineThumb } from './ProductImage';
import { TotalRow } from './Price';

export type SummaryLine = { key: string | number; name: string; meta: string; swatch: Swatch; image?: { url: string } | null; linePaisa: number };

/** Compact item list (52px thumbs) used in checkout and confirmation. */
export function SummaryLines({ lines }: { lines: SummaryLine[] }) {
  return (
    <>
      {lines.map((l) => (
        <div key={l.key} className="flex gap-3">
          <LineThumb swatch={l.swatch} image={l.image} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-ui font-medium">{l.name}</span>
            <span className="text-caption text-ink-2">{l.meta}</span>
          </span>
          <span className="price text-ui whitespace-nowrap">{formatPKR(l.linePaisa)}</span>
        </div>
      ))}
    </>
  );
}

/** Subtotal / shipping / total block. */
export function Totals({ subtotalPaisa, shippingPaisa, totalLabel, divided = true }: { subtotalPaisa: number; shippingPaisa: number; totalLabel: string; divided?: boolean }) {
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-3 text-body">
      <TotalRow label="Subtotal" value={formatPKR(subtotalPaisa)} />
      <TotalRow label="Shipping" value={shippingPaisa ? formatPKR(shippingPaisa) : 'Free'} />
      <div className={divided ? 'border-t border-line pt-2.5' : undefined}>
        <TotalRow strong label={totalLabel} value={formatPKR(subtotalPaisa + shippingPaisa)} />
      </div>
    </div>
  );
}

/** Bordered summary card with a heading. */
export function SummaryCard({ title, children, className }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <aside aria-label="Order summary" className={`card-box flex flex-col gap-3.5 p-5 ${className ?? ''}`}>
      <h2 className="m-0 text-group font-semibold">{title}</h2>
      {children}
    </aside>
  );
}

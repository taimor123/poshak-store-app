'use client';
import { SIZES } from '@/lib/catalog/sizes';
import type { Size } from '@/lib/catalog/types';

/** Size radiogroup. Sold-out sizes are disabled and struck through. */
export function SizeSelector({ value, onChange, stockFor, labelledBy, label }: { value: Size | null; onChange: (z: Size) => void; stockFor: (z: Size) => number; labelledBy?: string; label?: string }) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : (label ?? 'Size')} className="flex flex-wrap gap-2">
      {SIZES.map((z) => {
        const out = stockFor(z) === 0;
        return (
          <button key={z} type="button" role="radio" aria-checked={value === z} data-on={value === z} className="size-chip" disabled={out} aria-label={z + (out ? ', out of stock' : '')} onClick={() => onChange(z)}>
            {z}
          </button>
        );
      })}
    </div>
  );
}

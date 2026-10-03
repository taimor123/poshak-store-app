'use client';

export type SizeOption = { label: string; available: number };

/** Size radiogroup over the product's offered sizes. Sold-out sizes are disabled and struck through. */
export function SizeSelector({ options, value, onChange, labelledBy, label }: { options: SizeOption[]; value: string | null; onChange: (size: string) => void; labelledBy?: string; label?: string }) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : (label ?? 'Size')} className="flex flex-wrap gap-2">
      {options.map(({ label: z, available }) => {
        const out = available === 0;
        return (
          <button key={z} type="button" role="radio" aria-checked={value === z} data-on={value === z} className="size-chip" disabled={out} aria-label={z + (out ? ', out of stock' : '')} onClick={() => onChange(z)}>
            {z}
          </button>
        );
      })}
    </div>
  );
}

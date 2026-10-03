'use client';
import { MinusIcon, PlusIcon } from './icons';

export function QtyStepper({ qty, min = 1, max, onChange, label = 'Quantity' }: { qty: number; min?: number; max: number; onChange: (qty: number) => void; label?: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-none items-center rounded-btn border border-line-strong bg-surface">
      <button type="button" className="icon-btn" onClick={() => onChange(qty - 1)} disabled={qty <= min} aria-label="Decrease quantity">
        <MinusIcon />
      </button>
      <span className="min-w-6 text-center text-body font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" className="icon-btn" onClick={() => onChange(qty + 1)} disabled={qty >= max} aria-label="Increase quantity">
        <PlusIcon />
      </button>
    </div>
  );
}

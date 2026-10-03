import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type FieldBase = {
  id: string;
  label: ReactNode;
  /** Shown in red below the field; also sets aria-invalid. */
  error?: string;
  /** Helper text shown when there's no error. */
  hint?: ReactNode;
  optional?: string;
  className?: string;
};

function FieldShell({ id, label, error, hint, optional, className, children }: FieldBase & { children: ReactNode }) {
  const msg = error ?? hint;
  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-ink-2"> ({optional})</span>}
      </label>
      {children}
      {msg && (
        <p id={`${id}-msg`} className={cn('m-0 mt-1.5 text-caption', error ? 'font-medium text-sale' : 'text-ink-2')}>
          {msg}
        </p>
      )}
    </div>
  );
}

/** Label + 48px input + error/hint. */
export function TextField({ id, label, error, hint, optional, className, ...input }: FieldBase & Omit<ComponentProps<'input'>, 'id'>) {
  return (
    <FieldShell {...{ id, label, error, hint, optional, className }}>
      <input id={id} className={cn('input', input.type === 'search' && 'bg-page')} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...input} />
    </FieldShell>
  );
}

export function SelectField({ id, label, error, hint, optional, className, options, placeholder, ...select }: FieldBase & Omit<ComponentProps<'select'>, 'id'> & { options: readonly string[]; placeholder?: string }) {
  return (
    <FieldShell {...{ id, label, error, hint, optional, className }}>
      <select id={id} className="input cursor-pointer" aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...select}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Checkbox / radio row with a 44px hit area. */
export function CheckRow({ label, trailing, className, ...input }: ComponentProps<'input'> & { label: ReactNode; trailing?: ReactNode }) {
  return (
    <label className={cn('flex min-h-11 cursor-pointer items-center gap-3 text-body text-ink', className)}>
      <input className="size-[18px] accent-brand" {...input} />
      <span className="flex-1">{label}</span>
      {trailing}
    </label>
  );
}

/** Selectable card with a radio (delivery / payment options). */
export function RadioCard({ checked, disabled, title, caption, trailing, ...input }: Omit<ComponentProps<'input'>, 'title'> & { title: ReactNode; caption?: ReactNode; trailing?: ReactNode }) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 rounded-card border px-4 py-3.5',
        disabled ? 'cursor-not-allowed border-line bg-page' : checked ? 'cursor-pointer border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]' : 'cursor-pointer border-line bg-surface',
      )}
    >
      <input type="radio" className="mt-0.5 size-[18px] flex-none accent-brand" checked={checked} disabled={disabled} {...input} />
      <span className="flex flex-1 flex-col gap-0.5">
        <span className={cn('text-body font-semibold', disabled && 'text-ink-2')}>{title}</span>
        {caption && <span className="text-caption text-ink-2">{caption}</span>}
      </span>
      {trailing && <span className={cn('price text-body', disabled && 'text-ink-2')}>{trailing}</span>}
    </label>
  );
}

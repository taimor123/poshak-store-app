import type { ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

/** Native <details> accordion: works without JS, keyboard accessible. */
export function Accordion({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <div>
      {items.map((it) => (
        <details key={it.title} className="group border-b border-line">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between text-body font-semibold [&::-webkit-details-marker]:hidden">
            {it.title}
            <ChevronDownIcon size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-0 mb-4 text-body text-ink-2">{it.body}</div>
        </details>
      ))}
    </div>
  );
}

import type { ReactNode } from 'react';
import { whatsappHref } from '@/lib/contact';

/** Alt-background panel ending a content page with a WhatsApp CTA. */
export function HelpPanel({ title, children, cta = 'Ask on WhatsApp', inline }: { title?: string; children: ReactNode; cta?: string; inline?: boolean }) {
  const button = (
    <a className="btn-primary" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
      {cta}
    </a>
  );
  if (inline)
    return (
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-alt p-6">
        <p className="m-0 max-w-[48ch] text-body">{children}</p>
        {button}
      </section>
    );
  return (
    <section aria-labelledby="help-h" className="flex flex-col items-start gap-2.5 rounded-card bg-alt p-6">
      <h2 id="help-h" className="h-section">
        {title}
      </h2>
      <p className="m-0 max-w-[60ch] text-body text-ink-2">{children}</p>
      <div className="mt-1.5">{button}</div>
    </section>
  );
}

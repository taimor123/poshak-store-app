import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { Icon } from './icons';

/** Section heading row: h2 + optional action on the right. */
export function SectionHeader({ id, title, action, className }: { id?: string; title: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-5 flex items-baseline justify-between gap-4', className)}>
      <h2 id={id} className="h-section">
        {title}
      </h2>
      {action}
    </div>
  );
}

/** "View all →" style link for SectionHeader. */
export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="py-2 text-body font-semibold text-brand no-underline hover:underline">
      {children}
    </Link>
  );
}

/** Page title block: optional eyebrow, h1, intro. Exactly one per page. */
export function PageHeading({ eyebrow, title, intro, children }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {eyebrow && <p className="eyebrow m-0 text-brand">{eyebrow}</p>}
      <h1 className="h-page m-0">{title}</h1>
      {intro && <p className="m-0 max-w-[62ch] text-[15px] leading-6 text-ink-2">{intro}</p>}
      {children}
    </div>
  );
}

/** Centered empty / no-results state inside a bordered card. */
export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('card-box flex animate-fadein flex-col items-center gap-2.5 px-6 py-12 text-center', className)}>
      {icon}
      <p className="m-0 text-group font-semibold">{title}</p>
      {body && <p className="m-0 max-w-[44ch] text-body text-ink-2">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Icon + short label, used in feature/value-prop strips. */
export function IconFeature({ icon: I, children }: { icon: Icon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <I className="flex-none text-brand" />
      <span className="text-body font-medium">{children}</span>
    </div>
  );
}

/** Small titled card (charges, how-to-measure). */
export function InfoCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="card-box flex flex-col gap-1 p-4">
      <span className="text-body font-semibold">{title}</span>
      <span className="text-ui text-ink-2">{children}</span>
    </div>
  );
}

/** Numbered steps with maroon ring numerals. */
export function NumberedSteps({ steps, className }: { steps: { title: ReactNode; body?: ReactNode }[]; className?: string }) {
  return (
    <ol className={cn('m-0 flex list-none flex-col gap-3 p-0', className)}>
      {steps.map((s, i) => (
        <li key={i} className="grid grid-cols-[28px_1fr] gap-3">
          <span className="size-7 rounded-full border-[1.5px] border-brand text-center text-caption leading-[25px] font-semibold text-brand">{i + 1}</span>
          <span className="flex flex-col gap-0.5 pt-[3px]">
            <span className="text-body font-semibold">{s.title}</span>
            {s.body && <span className="text-ui text-ink-2">{s.body}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Rounded pill: status, badge. */
export function Pill({ tone = 'brand', dot, children }: { tone?: 'brand' | 'success'; dot?: boolean; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-caption font-semibold', tone === 'success' ? 'bg-success-tint text-success' : 'bg-selected text-brand')}>
      {dot && <span aria-hidden="true" className={cn('size-1.5 rounded-full', tone === 'success' ? 'bg-success' : 'bg-brand')} />}
      {children}
    </span>
  );
}

/** Small uppercase label above a group of content. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 mb-2 text-label font-semibold text-ink-2 uppercase', className)}>{children}</p>;
}

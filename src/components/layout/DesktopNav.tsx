'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { headerNav } from '@/config/nav';
import { useEscape, useOutsideClick } from '@/hooks/a11y';
import { ChevronDownIcon } from '@/components/ui/icons';

/** ≥1024px: category dropdowns (open on click) + plain links. */
export function DesktopNav({ active }: { active?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const close = () => setOpen(null);
  useOutsideClick(ref, !!open, close);
  useEscape(!!open, close);

  return (
    <nav ref={ref} aria-label="Main" className="mx-auto hidden items-center gap-0.5 lg:flex">
      {headerNav.map((entry) =>
        entry.kind === 'link' ? (
          <Link key={entry.key} href={entry.href} className="navlink" data-active={active === entry.key}>
            {entry.label}
          </Link>
        ) : (
          <div key={entry.key} className="relative">
            <button
              type="button"
              className="navlink"
              data-active={active === entry.key}
              aria-haspopup="true"
              aria-expanded={open === entry.key}
              onClick={() => setOpen(open === entry.key ? null : entry.key)}
            >
              {entry.label} <ChevronDownIcon />
            </button>
            {open === entry.key && (
              <div className="absolute top-[calc(100%+4px)] left-0 z-70 min-w-[230px] rounded-card border border-line bg-surface p-1.5 shadow-pop">
                <Link href={entry.href} className="menu-item font-semibold" onClick={close}>
                  {entry.allLabel}
                </Link>
                {entry.items.map((it) => (
                  <Link key={it.href} href={it.href} className="menu-item" onClick={close}>
                    {it.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ),
      )}
    </nav>
  );
}

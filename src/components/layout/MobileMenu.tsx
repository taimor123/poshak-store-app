'use client';
import Link from 'next/link';
import { useState } from 'react';
import { drawerLinks, headerNav } from '@/config/nav';
import { cn } from '@/lib/cn';
import { Drawer } from '@/components/ui/Overlay';
import { ChevronDownIcon } from '@/components/ui/icons';
import { Logo } from './Logo';

const topLink = 'flex min-h-12 items-center rounded-btn px-2 text-[16px] font-semibold no-underline hover:bg-alt';

/** <1024px: left drawer with category accordions, then account/help links. */
export function MobileMenu({ open, onClose, signedIn, wishCount }: { open: boolean; onClose: () => void; signedIn: boolean; wishCount: number }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Drawer open={open} onClose={onClose} label="Menu" side="left" title={<Logo size="drawer" />}>
      <nav
        aria-label="Mobile"
        className="flex flex-col px-3 pt-2 pb-6"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) onClose();
        }}
      >
        {headerNav.map((entry) =>
          entry.kind === 'link' ? (
            <Link key={entry.key} href={entry.href} className={cn(topLink, entry.tone === 'sale' ? 'text-sale hover:text-sale' : 'text-ink hover:text-ink')}>
              {entry.label}
            </Link>
          ) : (
            <div key={entry.key}>
              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-between rounded-btn px-2 py-3 text-left text-[16px] leading-6 font-semibold text-ink hover:bg-alt"
                aria-expanded={expanded === entry.key}
                onClick={() => setExpanded(expanded === entry.key ? null : entry.key)}
              >
                {entry.label}
                <ChevronDownIcon size={16} className={expanded === entry.key ? 'rotate-180' : ''} />
              </button>
              {expanded === entry.key && (
                <div className="flex flex-col pb-2 pl-3">
                  <Link href={entry.href} className="menu-item font-semibold">
                    {entry.allLabel}
                  </Link>
                  {entry.items.map((it) => (
                    <Link key={it.href} href={it.href} className="menu-item">
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        <div className="mt-3 flex flex-col border-t border-line pt-3">
          {drawerLinks(signedIn, wishCount).map((l) => (
            <Link key={l.href} href={l.href} className="menu-item">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </Drawer>
  );
}

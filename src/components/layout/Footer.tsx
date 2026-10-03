'use client';
import Link from 'next/link';
import { footerNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { storeConfig } from '@/config/store';
import { emailHref, whatsappHref } from '@/lib/contact';
import { toast } from '@/stores/ui';
import { Logo } from './Logo';

const heading = 'mb-2 text-label font-semibold uppercase text-page/60';
const link = 'inline-block py-2 text-body text-page/85 no-underline hover:text-page hover:underline hover:underline-offset-[3px]';

export function Footer() {
  return (
    <footer className="mt-14 bg-band text-page">
      <div className="wrap pt-12 pb-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-6">
          <div>
            <Logo size="footer" />
            <p className="m-0 mt-2 text-ui text-page/75">{siteConfig.tagline}</p>
          </div>
          {footerNav(whatsappHref(), emailHref()).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className={heading}>{col.title}</p>
              <div className="flex flex-col items-start">
                {col.links.map((l) =>
                  l.soon ? (
                    <a key={l.label} href={l.href} className={link} onClick={(e) => { e.preventDefault(); toast(`${l.label} is coming soon`); }}>
                      {l.label}
                    </a>
                  ) : l.external ? (
                    <a key={l.label} href={l.href} className={link} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.label} href={l.href} className={link}>
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-page/20 pt-5 text-caption text-page/70">
          <span>
            © {siteConfig.copyrightYear} {siteConfig.name} · {siteConfig.location}
          </span>
          <span>Cash on delivery{storeConfig.cardPaymentsLive ? ' · Cards accepted' : ' · Cards coming soon'}</span>
        </div>
      </div>
    </footer>
  );
}

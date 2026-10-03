import Link from 'next/link';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { storeConfig } from '@/config/store';
import { CATEGORIES, CATEGORY_KEYS } from '@/lib/catalog/categories';
import { formatPKR } from '@/lib/format';
import { ButtonLink } from '@/components/ui/Button';
import { IconFeature } from '@/components/ui/Blocks';
import { BoxIcon, CashIcon, ChatIcon, ReturnIcon, RulerIcon, TruckIcon } from '@/components/ui/icons';
import { ProductImage } from '@/components/commerce/ProductImage';

/** Split hero: text left (5fr), 4:5 visual right (6fr); stacked with the visual on top on mobile. */
export function Hero() {
  return (
    <section aria-label="Featured">
      <div className="wrap pt-7 pb-4">
        <div className="grid gap-7 md:grid-cols-[5fr_6fr] md:items-center md:gap-12">
          <div className="flex flex-col items-start justify-center gap-4">
            <p className="eyebrow m-0 text-brand">Lawn ’26 has arrived</p>
            <h1 className="h-hero m-0">Stitched to your measurements, honest to the thread.</h1>
            <p className="m-0 max-w-[46ch] text-[15px] leading-6 text-ink-2">Unstitched fabrics and ready-to-wear pret, delivered across Pakistan — cash on delivery.</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-5">
              <ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>
              <ButtonLink variant="link" href={routes.category('unstitched')}>
                Explore unstitched →
              </ButtonLink>
            </div>
          </div>
          <div className="order-first md:order-last">
            <ProductImage swatch="mustard" ratio="4/5" motif="42%" alt="Placeholder visual: kameez line drawing on mustard" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** 3 category tiles: 2-col on mobile with the 3rd spanning full width. */
export function CategoryTiles() {
  return (
    <section aria-labelledby="cats-h">
      <div className="wrap pt-9 pb-2">
        <h2 id="cats-h" className="h-section mb-5">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 [&>*:nth-child(3)]:col-span-2 md:[&>*:nth-child(3)]:col-span-1">
          {CATEGORY_KEYS.map((key) => {
            const c = CATEGORIES[key];
            return (
              <Link key={key} href={routes.category(key)} className="tile flex flex-col gap-2.5 rounded-card text-ink no-underline hover:text-ink">
                <ProductImage swatch={c.swatch} alt={`${c.name}: placeholder kameez line drawing`} />
                <span className="flex flex-col gap-0.5 px-0.5">
                  <span className="text-group font-semibold">{c.name}</span>
                  <span className="text-caption text-ink-2">from {formatPKR(c.fromPaisa)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** "Measured, so it fits." trust band on the alt background. */
export function FitTrustBand() {
  return (
    <section aria-labelledby="fit-h" className="mt-12 bg-alt">
      <div className="wrap py-12">
        <h2 id="fit-h" className="h-section">
          Measured, so it fits.
        </h2>
        <p className="m-0 mt-3 max-w-[62ch] text-[15px] leading-6 text-ink-2">
          Every stitched piece lists real garment measurements in inches — chest, waist, length — not just S/M/L. Unstitched suits list exact fabric yardage per piece.
        </p>
        <div className="mt-7 grid gap-[18px] md:grid-cols-3 md:gap-6">
          <IconFeature icon={RulerIcon}>Real measurement charts</IconFeature>
          <IconFeature icon={BoxIcon}>Honest stock — no fake scarcity</IconFeature>
          <IconFeature icon={ChatIcon}>Easy size help on WhatsApp</IconFeature>
        </div>
      </div>
    </section>
  );
}

/** Flat brand-colour promo banner. No countdowns, ever. */
export function PromoBanner({ eyebrow, title, cta, href }: { eyebrow: string; title: string; cta: string; href: string }) {
  return (
    <section aria-label={eyebrow} className="mt-12 bg-brand">
      <div className="wrap flex min-h-[236px] flex-col items-center justify-center gap-2.5 py-11 text-center">
        <p className="eyebrow m-0 text-page/75">{eyebrow}</p>
        <p className="h-section m-0 text-page">{title}</p>
        <ButtonLink variant="ivory" href={href} className="mt-2.5">
          {cta}
        </ButtonLink>
      </div>
    </section>
  );
}

/** 4 value props; 2×2 on mobile. */
export function ValueProps() {
  const [a, b] = storeConfig.standardDays;
  return (
    <section aria-label={`Why shop with ${siteConfig.name}`}>
      <div className="wrap pt-11 pb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          <IconFeature icon={CashIcon}>Cash on delivery</IconFeature>
          <IconFeature icon={TruckIcon}>{`Nationwide shipping, ${a}–${b} days`}</IconFeature>
          <IconFeature icon={ReturnIcon}>{`${storeConfig.returnWindowDays}-day easy returns`}</IconFeature>
          <IconFeature icon={ChatIcon}>WhatsApp support</IconFeature>
        </div>
      </div>
    </section>
  );
}

'use client';
import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { stockNote, swatchFor } from '@/lib/catalog/product';
import type { ProductCard as Product } from '@/lib/catalog/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Price } from './Price';
import { ProductImage } from './ProductImage';
import { QuickView } from './QuickView';
import { WishButton } from './WishButton';

const BADGE = { NEW: 'New', SALE: 'Sale' } as const;

/**
 * THE product card — identical everywhere: 3:4 image → name (2-line clamp) →
 * price → optional honest stock caption. The whole card is one link; the
 * heart and quick-view are separate buttons layered above it.
 */
export function ProductCard({ product: p }: { product: Product }) {
  const [quickView, setQuickView] = useState(false);
  const note = stockNote(p);
  return (
    <div className="card relative flex flex-col gap-2.5 text-ink">
      <ProductImage image={p.image} swatch={swatchFor(p.colour)} alt={`${p.name}${p.colour ? `, ${p.colour.toLowerCase()}` : ''}`}>
        {p.badge && <span className="pointer-events-none absolute top-3 left-3 z-2 rounded-full bg-surface px-2.5 py-[5px] text-label font-semibold text-ink uppercase">{BADGE[p.badge]}</span>}
        <button
          type="button"
          className="qv absolute inset-x-2 bottom-2 z-2 min-h-10 translate-y-1.5 rounded-btn bg-surface/95 text-ui font-semibold text-ink opacity-0 transition hover:bg-surface hover:text-brand"
          onClick={() => setQuickView(true)}
          aria-label={`Quick view: ${p.name}`}
        >
          Quick view
        </button>
      </ProductImage>
      <WishButton product={p} />
      <div className="flex flex-col gap-[5px] px-0.5">
        <Link href={routes.product(p.slug)} className="stretched text-ink no-underline hover:text-ink">
          <span className="card-name line-clamp-2 text-body font-medium">{p.name}</span>
        </Link>
        <Price paisa={p.pricePaisa} compareAtPaisa={p.compareAtPaisa ?? undefined} />
        {note && <span className={`text-caption ${note.tone === 'warning' ? 'text-warning' : 'text-ink-2'}`}>{note.text}</span>}
      </div>
      {quickView && <QuickView product={p} onClose={() => setQuickView(false)} />}
    </div>
  );
}

/** Same box as <ProductCard>, so swapping in content causes zero layout shift. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      <Skeleton className="rounded-card" style={{ aspectRatio: '3/4' }} />
      <Skeleton className="h-[15px] w-[70%] rounded" />
      <Skeleton className="h-[15px] w-[40%] rounded" />
      <Skeleton className="h-[15px] w-[30%] rounded" />
    </div>
  );
}

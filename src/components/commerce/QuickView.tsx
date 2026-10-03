'use client';
import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { isStitched, metaLine, swatchFor } from '@/lib/catalog/product';
import type { ProductCard } from '@/lib/catalog/types';
import { Modal } from '@/components/ui/Overlay';
import { CloseIcon } from '@/components/ui/icons';
import { useAddToCart } from './useAddToCart';
import { Price } from './Price';
import { ProductImage } from './ProductImage';
import { SizeSelector } from './SizeSelector';
import { StockMessage } from './StockMessage';

/** Desktop quick-view modal: image | details, size choice, add to cart. */
export function QuickView({ product: p, onClose }: { product: ProductCard; onClose: () => void }) {
  const [size, setSize] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const { add, pending } = useAddToCart();
  const stitched = isStitched(p);
  const out = p.stock.total === 0;
  const chosen = p.sizes.find((s) => s.label === size);
  const left = stitched && chosen ? chosen.stock : p.stock.total;

  const onAdd = async () => {
    const variantId = stitched ? chosen?.variantId : p.variantId;
    if (!variantId) return setErr('Choose a size first.');
    if (await add(p, variantId, 1)) onClose();
  };

  return (
    <Modal open onClose={onClose} label={`Quick view: ${p.name}`} className="grid w-[min(760px,100%)] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <ProductImage image={p.image} swatch={swatchFor(p.colour)} alt={p.name} motif="40%" className="rounded-r-none" sizes="380px" />
      <div className="relative flex flex-col gap-3.5 p-6">
        <button type="button" className="icon-btn absolute top-2 right-2" aria-label="Close quick view" onClick={onClose}>
          <CloseIcon />
        </button>
        <p className="m-0 pr-10 text-caption text-ink-2">{metaLine(p)}</p>
        <h2 className="m-0 -mt-1.5 pr-6 font-display text-[22px] leading-7 font-semibold">{p.name}</h2>
        <Price paisa={p.pricePaisa} compareAtPaisa={p.compareAtPaisa ?? undefined} />
        {stitched ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-ui font-semibold">Size</span>
              <span className="text-caption text-ink-2">Measurements on the full page</span>
            </div>
            <SizeSelector options={p.sizes.map((s) => ({ label: s.label, available: s.stock }))} value={size} onChange={(z) => { setSize(z); setErr(''); }} />
          </div>
        ) : (
          <p className="m-0 text-ui text-ink-2">Exact yardage for every piece is on the full page.</p>
        )}
        <StockMessage left={out ? 0 : left} size={size} />
        {err && (
          <p role="alert" className="m-0 text-ui font-medium text-sale">
            {err}
          </p>
        )}
        <button type="button" className="btn-primary" disabled={out || pending} onClick={onAdd}>
          {out ? 'Out of stock' : pending ? 'Adding…' : 'Add to cart'}
        </button>
        <Link href={routes.product(p.slug)} className="tlink self-start">
          View full details →
        </Link>
      </div>
    </Modal>
  );
}

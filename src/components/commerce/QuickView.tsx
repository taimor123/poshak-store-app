'use client';
import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { isStitched, metaLine, packPieces, sizeStock, totalStock } from '@/lib/catalog/product';
import { SHIRT_CHART } from '@/lib/catalog/sizes';
import type { Product, Size } from '@/lib/catalog/types';
import { Modal } from '@/components/ui/Overlay';
import { CloseIcon } from '@/components/ui/icons';
import { useAddToCart } from './useAddToCart';
import { Price } from './Price';
import { ProductImage } from './ProductImage';
import { SizeSelector } from './SizeSelector';
import { StockMessage } from './StockMessage';

/** Desktop quick-view modal: image | details, size choice, add to cart. */
export function QuickView({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const [size, setSize] = useState<Size | null>(null);
  const [err, setErr] = useState('');
  const addToCart = useAddToCart();
  const stitched = isStitched(p);
  const out = totalStock(p) === 0;
  const left = stitched && size ? sizeStock(p, size) : totalStock(p);

  const add = () => {
    if (stitched && !size) return setErr('Choose a size first.');
    onClose();
    addToCart(p, stitched ? size : null, 1);
  };

  return (
    <Modal open onClose={onClose} label={`Quick view: ${p.name}`} className="grid w-[min(760px,100%)] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <ProductImage swatch={p.swatch} alt={p.name} motif="40%" className="rounded-r-none" />
      <div className="relative flex flex-col gap-3.5 p-6">
        <button type="button" className="icon-btn absolute top-2 right-2" aria-label="Close quick view" onClick={onClose}>
          <CloseIcon />
        </button>
        <p className="m-0 pr-10 text-caption text-ink-2">{metaLine(p)}</p>
        <h2 className="m-0 -mt-1.5 pr-6 font-display text-[22px] leading-7 font-semibold">{p.name}</h2>
        <Price paisa={p.pricePaisa} compareAtPaisa={p.compareAtPaisa} />
        {stitched ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-ui font-semibold">Size</span>
              <span className="text-caption text-ink-2">{size ? `Garment chest ${SHIRT_CHART[size][0]} in` : 'Measurements on the full page'}</span>
            </div>
            <SizeSelector value={size} stockFor={(z) => sizeStock(p, z)} onChange={(z) => { setSize(z); setErr(''); }} />
          </div>
        ) : (
          <p className="m-0 text-ui text-ink-2">{packPieces(p).map((x) => `${x.piece} ${x.yards} yd`).join(' · ')}</p>
        )}
        <StockMessage left={out ? 0 : left} size={size} />
        {err && (
          <p role="alert" className="m-0 text-ui font-medium text-sale">
            {err}
          </p>
        )}
        <button type="button" className="btn-primary" disabled={out} onClick={add}>
          {out ? 'Out of stock' : 'Add to cart'}
        </button>
        <Link href={routes.product(p.slug)} className="tlink self-start">
          View full details →
        </Link>
      </div>
    </Modal>
  );
}

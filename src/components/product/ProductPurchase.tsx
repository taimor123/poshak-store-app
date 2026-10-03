'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { routes } from '@/config/routes';
import { storeConfig } from '@/config/store';
import { whatsappHref } from '@/lib/contact';
import { formatPKR } from '@/lib/format';
import { isStitched, packPieces, sizeStock, totalStock } from '@/lib/catalog/product';
import type { Unit } from '@/lib/catalog/sizes';
import type { Product, Size } from '@/lib/catalog/types';
import { useShopper } from '@/stores/shopper';
import { useUi } from '@/stores/ui';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { Segmented } from '@/components/ui/Segmented';
import { ChatIcon } from '@/components/ui/icons';
import { PackContentsTable, ShirtChart, TrouserChart } from '@/components/commerce/MeasurementTables';
import { SizeSelector } from '@/components/commerce/SizeSelector';
import { StockMessage } from '@/components/commerce/StockMessage';
import { useAddToCart } from '@/components/commerce/useAddToCart';

/**
 * PDP interactive island: size choice + measurements (stitched) or pack
 * contents (unstitched), quantity, add to cart, WhatsApp help.
 */
export function ProductPurchase({ product: p }: { product: Product }) {
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState<Unit>('in');
  const [err, setErr] = useState('');
  const addToCart = useAddToCart();
  useRecordView(p);

  const stitched = isStitched(p);
  const total = totalStock(p);
  const out = total === 0;
  const left = stitched && size ? sizeStock(p, size) : total;
  const maxQty = Math.max(1, Math.min(storeConfig.maxQtyPerLine, left));

  const add = () => {
    if (stitched && !size) return setErr('Choose a size first. Not sure? Compare the chart above or ask us on WhatsApp.');
    addToCart(p, stitched ? size : null, qty);
  };

  return (
    <>
      {stitched ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span id="size-label" className="text-body font-semibold">
              Size {size && <span className="font-normal text-ink-2">· {size}</span>}
            </span>
            <Link href={routes.sizeGuide} className="text-ui font-semibold text-brand no-underline hover:underline">
              Size guide
            </Link>
          </div>
          <SizeSelector labelledBy="size-label" value={size} stockFor={(z) => sizeStock(p, z)} onChange={(z) => { setSize(z); setErr(''); setQty(1); }} />
          <StockMessage left={left} size={size} prompt={size ? undefined : 'Choose a size. Check the measurements below if you’re between two.'} />
          <div className="mt-1 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-body font-semibold">Garment measurements</span>
              <Segmented label="Units" value={unit} onChange={setUnit} options={[{ value: 'in', label: 'Inches' }, { value: 'cm', label: 'cm' }]} />
            </div>
            {p.sub === 'trousers' ? <TrouserChart unit={unit} selected={size} /> : <ShirtChart unit={unit} lengthIn={p.lengthIn ?? 40} selected={size} />}
            <p className="m-0 text-caption text-ink-2">Measured flat on the finished garment, all the way around. Allow 2–3 inches of ease over your own chest measurement.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <span className="text-body font-semibold">What’s in the pack</span>
          <PackContentsTable pieces={packPieces(p)} />
          <p className="m-0 text-caption text-ink-2">Enough fabric for sizes up to XL with a standard kameez length of 42 in. Stitching not included. Need more? Ask us before you order.</p>
          <StockMessage left={total} inStockText={`In stock · ${total} packs`} />
        </div>
      )}

      <div className="flex gap-2.5">
        <QtyStepper qty={qty} max={maxQty} onChange={(n) => setQty(Math.max(1, Math.min(maxQty, n)))} />
        <button type="button" className="btn-primary flex-1" disabled={out} onClick={add}>
          {out ? 'Out of stock' : `Add to cart · ${formatPKR(p.pricePaisa * qty)}`}
        </button>
      </div>
      {err && (
        <p role="alert" className="-mt-2.5 mb-0 text-ui font-medium text-sale">
          {err}
        </p>
      )}
      <a className="btn-secondary" href={whatsappHref(`Hi! I have a question about ${p.name}.`)} target="_blank" rel="noopener noreferrer">
        <ChatIcon size={18} />
        {stitched ? 'Ask about fit on WhatsApp' : 'Ask about this fabric on WhatsApp'}
      </a>
    </>
  );
}

/** Writes this product to "recently viewed" once the persisted stores have loaded. */
function useRecordView(p: Product) {
  const hydrated = useUi((s) => s.hydrated);
  const markViewed = useShopper((s) => s.markViewed);
  const prime = useUi((s) => s.primeProducts);
  useEffect(() => {
    if (!hydrated) return;
    prime([p]);
    markViewed(p.slug);
  }, [hydrated, p, markViewed, prime]);
}

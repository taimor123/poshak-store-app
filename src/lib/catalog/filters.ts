import { formatPKR } from '@/lib/format';
import { isStitched } from './product';
import { SIZES } from './sizes';
import type { Product, Size } from './types';

/**
 * Listing filters live in the URL (?s=&fabric=&price=&size=&sale=1&stock=1&sort=),
 * never in a store. These helpers parse, apply and rebuild that query string.
 */

export type SortKey = 'new' | 'low' | 'high';
export type ListingFilters = {
  sub: string | null;
  fabrics: string[];
  price: string | null;
  sizes: Size[];
  onSale: boolean;
  inStock: boolean;
  sort: SortKey;
};

const K = (rupees: number) => rupees * 100;
export const PRICE_BANDS: { key: string; label: string; test: (paisa: number) => boolean }[] = [
  { key: 'u5', label: `Under ${formatPKR(K(5000))}`, test: (p) => p < K(5000) },
  { key: '5-10', label: `${formatPKR(K(5000))} – ${formatPKR(K(10000)).replace('PKR ', '')}`, test: (p) => p >= K(5000) && p <= K(10000) },
  { key: '10-20', label: `${formatPKR(K(10000))} – ${formatPKR(K(20000)).replace('PKR ', '')}`, test: (p) => p > K(10000) && p <= K(20000) },
  { key: 'o20', label: `Over ${formatPKR(K(20000))}`, test: (p) => p > K(20000) },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'new', label: 'Newest' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
];

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) => (one(v) ?? '').split(',').map((x) => x.trim()).filter(Boolean);

export function parseFilters(sp: Params): ListingFilters {
  const sort = one(sp.sort);
  const price = one(sp.price);
  return {
    sub: one(sp.s) || null,
    fabrics: list(sp.fabric),
    price: PRICE_BANDS.some((b) => b.key === price) ? price! : null,
    sizes: list(sp.size).filter((z): z is Size => (SIZES as string[]).includes(z)),
    onSale: one(sp.sale) === '1',
    inStock: one(sp.stock) === '1',
    sort: sort === 'low' || sort === 'high' ? sort : 'new',
  };
}

export function toQuery(f: ListingFilters): string {
  const q = new URLSearchParams();
  if (f.sub) q.set('s', f.sub);
  if (f.fabrics.length) q.set('fabric', f.fabrics.join(','));
  if (f.price) q.set('price', f.price);
  if (f.sizes.length) q.set('size', f.sizes.join(','));
  if (f.onSale) q.set('sale', '1');
  if (f.inStock) q.set('stock', '1');
  if (f.sort !== 'new') q.set('sort', f.sort);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const EMPTY_FILTERS: ListingFilters = { sub: null, fabrics: [], price: null, sizes: [], onSale: false, inStock: false, sort: 'new' };

const hasStock = (p: Product) => (p.stock.kind === 'pack' ? p.stock.qty > 0 : Object.values(p.stock.bySize).some((n) => n > 0));

export function applyFilters(base: Product[], f: ListingFilters) {
  const afterSub = f.sub ? base.filter((p) => p.sub === f.sub) : base;
  const band = PRICE_BANDS.find((b) => b.key === f.price);
  const results = afterSub
    .filter((p) => !f.fabrics.length || f.fabrics.includes(p.fabric))
    .filter((p) => !band || band.test(p.pricePaisa))
    .filter((p) => !f.sizes.length || (p.stock.kind === 'sizes' && f.sizes.some((z) => (p.stock as { bySize: Record<Size, number> }).bySize[z] > 0)))
    .filter((p) => !f.onSale || !!p.compareAtPaisa)
    .filter((p) => !f.inStock || hasStock(p))
    .sort((a, b) => (f.sort === 'low' ? a.pricePaisa - b.pricePaisa : f.sort === 'high' ? b.pricePaisa - a.pricePaisa : a.addedDaysAgo - b.addedDaysAgo));

  const fabricCounts = Array.from(new Set(afterSub.map((p) => p.fabric)))
    .sort()
    .map((fabric) => ({ fabric, count: afterSub.filter((p) => p.fabric === fabric).length }));

  return { results, fabricCounts, hasStitched: afterSub.some(isStitched) };
}

/**
 * Listing filters live in the URL (?s=&fabric=&price=&size=&sale=1&stock=1&sort=),
 * never in a store. These helpers parse and rebuild that query string and map
 * it to the API's listing parameters. Filtering itself happens in the API.
 */

export type SortKey = 'new' | 'low' | 'high';
export type ListingFilters = {
  sub: string | null;
  fabrics: string[];
  price: string | null;
  sizes: string[];
  onSale: boolean;
  inStock: boolean;
  sort: SortKey;
};

export const PRICE_BANDS: { key: string; label: string }[] = [
  { key: 'u5', label: 'Under PKR 5,000' },
  { key: '5-10', label: 'PKR 5,000 – 10,000' },
  { key: '10-20', label: 'PKR 10,000 – 20,000' },
  { key: 'o20', label: 'Over PKR 20,000' },
];

export const SIZE_FILTERS = ['XS', 'S', 'M', 'L', 'XL'];

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
    sizes: list(sp.size).filter((z) => SIZE_FILTERS.includes(z)),
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

/** URL filters → API listing query params. */
export const toApiQuery = (f: ListingFilters, limit = 48) => ({
  fabric: f.fabrics.join(',') || undefined,
  price: f.price ?? undefined,
  size: f.sizes.join(',') || undefined,
  sale: f.onSale ? '1' : undefined,
  inStock: f.inStock ? '1' : undefined,
  sort: f.sort === 'low' ? 'price_asc' : f.sort === 'high' ? 'price_desc' : 'new',
  limit,
});

export const EMPTY_FILTERS: ListingFilters = { sub: null, fabrics: [], price: null, sizes: [], onSale: false, inStock: false, sort: 'new' };

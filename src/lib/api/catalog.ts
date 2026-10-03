import 'server-only';
import type { CategoryListing, CategoryNode, Listing, ProductCard, ProductDetail, PublicConfig, ShippingZone } from '@/lib/catalog/types';
import { storeConfig } from '@/config/store';
import { api, apiData } from './client';

/**
 * Catalogue reads for Server Components (public, cached briefly in the Next
 * data cache). Failures degrade to empty results so a slow API never blanks
 * the whole storefront; product/category lookups surface NOT_FOUND.
 */

type Query = Record<string, string | number | undefined>;
const EMPTY_LISTING: Listing = { items: [], total: 0, nextCursor: null, facets: { fabric: [], price: [], size: [], hasStitched: false } };

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const r = await api<CategoryNode[]>('/categories', { revalidate: 300 });
  return r.ok ? r.data : [];
}

/** null = unknown category (→ 404). Throws when the API is unreachable (→ error.tsx). */
export async function getCategoryListing(path: string, query: Query): Promise<CategoryListing | null> {
  const r = await api<CategoryListing>(`/categories/${path}/products`, { query, revalidate: 60 });
  if (r.ok) return r.data;
  if (r.error.code === 'NOT_FOUND') return null;
  throw new Error(r.error.message);
}

export async function getCollection(slug: string, query: Query = {}): Promise<Listing> {
  const r = await api<Listing>(`/collections/${slug}`, { query, revalidate: 60 });
  return r.ok ? r.data : EMPTY_LISTING;
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const r = await api<ProductDetail>(`/products/${encodeURIComponent(slug)}`, { revalidate: 30 });
  if (r.ok) return r.data;
  if (r.error.code === 'NOT_FOUND') return null;
  throw new Error(r.error.message);
}

export async function getProductsBySlugs(slugs: string[]): Promise<ProductCard[]> {
  if (!slugs.length) return [];
  const r = await api<ProductCard[]>('/products', { query: { slugs: slugs.join(',') }, revalidate: 30 });
  return r.ok ? r.data : [];
}

export async function searchProducts(q: string): Promise<Listing> {
  if (!q.trim()) return EMPTY_LISTING;
  const r = await api<Listing>('/search', { query: { q, limit: 48 }, revalidate: 30 });
  return r.ok ? r.data : EMPTY_LISTING;
}

export async function getPublicConfig(): Promise<{
  freeShippingThresholdPaisa: number;
  expressFeePaisa: number;
  lowStockThreshold: number;
  maxQtyPerLine: number;
  returnWindowDays: number;
}> {
  const r = await api<PublicConfig>('/config/public', { revalidate: 60 });
  return r.ok
    ? r.data
    : {
        freeShippingThresholdPaisa: storeConfig.freeShippingMinPaisa,
        expressFeePaisa: storeConfig.expressShippingPaisa,
        lowStockThreshold: storeConfig.lowStockThreshold,
        maxQtyPerLine: storeConfig.maxQtyPerLine,
        returnWindowDays: storeConfig.returnWindowDays,
      };
}

export async function getShippingZones(): Promise<ShippingZone[]> {
  return apiData<ShippingZone[]>('/shipping-zones', { revalidate: 300 });
}

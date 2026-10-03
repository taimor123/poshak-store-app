import 'server-only';
import { CATEGORIES, subLabel } from '@/lib/catalog/categories';
import { isStitched } from '@/lib/catalog/product';
import type { ListingKey, Product } from '@/lib/catalog/types';
import { MOCK_HOME_NEW_IN, MOCK_PRODUCTS } from '@/lib/mock/products';

/**
 * Catalogue reads. Server Components call these; client components receive
 * the results as props. Today they read demo data — when poshak-store-apis is
 * up, swap each body for a `client.ts` fetch (GET /api/v1/products …) and keep
 * the signatures.
 */

const NEW_WINDOW_DAYS = 14;

export async function getProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  return slugs.map((s) => MOCK_PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => !!p);
}

export async function getHomeNewIn(): Promise<Product[]> {
  return getProductsBySlugs(MOCK_HOME_NEW_IN);
}

export async function getNewThisWeek(limit = 4): Promise<Product[]> {
  return MOCK_PRODUCTS.filter((p) => p.addedDaysAgo <= NEW_WINDOW_DAYS).slice(0, limit);
}

/** Base set for a listing page, before shopper filters. */
export async function getListing(key: ListingKey): Promise<Product[]> {
  return MOCK_PRODUCTS.filter((p) =>
    key === 'new' ? p.addedDaysAgo <= NEW_WINDOW_DAYS : key === 'sale' ? !!p.compareAtPaisa : key === 'all' ? true : p.category === key,
  );
}

export async function getRelated(p: Product, limit = 4): Promise<Product[]> {
  return [
    ...MOCK_PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug),
    ...MOCK_PRODUCTS.filter((x) => x.category !== p.category),
  ].slice(0, limit);
}

export async function searchProducts(q: string): Promise<Product[]> {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return MOCK_PRODUCTS.filter((p) => {
    const hay = [p.name, p.fabric, p.colour, CATEGORIES[p.category].name, subLabel(p.category, p.sub), p.sub, isStitched(p) ? 'stitched pret' : 'unstitched']
      .join(' ')
      .toLowerCase();
    return words.every((w) => hay.includes(w.replace(/s$/, '')));
  });
}

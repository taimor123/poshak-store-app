'use server';
import { getProductsBySlugs } from '@/lib/api/catalog';
import type { Product } from '@/lib/catalog/types';

/**
 * Current product data for slugs held on the device (cart, wishlist, recently
 * viewed). Called on every cart view, so the current price always wins.
 */
export async function loadProducts(slugs: unknown): Promise<Product[]> {
  if (!Array.isArray(slugs)) return [];
  const clean = slugs.filter((s): s is string => typeof s === 'string' && /^[a-z0-9-]{1,80}$/.test(s)).slice(0, 50);
  return getProductsBySlugs(clean);
}

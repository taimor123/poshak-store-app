'use server';
import { getProductsBySlugs } from '@/lib/api/catalog';
import type { ProductCard } from '@/lib/catalog/types';

/** Current product cards for slugs held on the device (wishlist, recently viewed). */
export async function loadProducts(slugs: unknown): Promise<ProductCard[]> {
  if (!Array.isArray(slugs)) return [];
  const clean = slugs.filter((s): s is string => typeof s === 'string' && /^[a-z0-9-]{1,80}$/.test(s)).slice(0, 50);
  return getProductsBySlugs(clean);
}

'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadProducts } from '@/lib/actions/catalog';
import type { ProductCard } from '@/lib/catalog/types';
import { useUi } from '@/stores/ui';

/**
 * Product cards for slugs held on the device (wishlist, recently viewed).
 * Cached in memory for an instant repaint; slugs the API no longer returns
 * (archived products) simply drop out.
 */
export function useProducts(slugs: string[]) {
  const hydrated = useUi((s) => s.hydrated);
  const cache = useUi((s) => s.products);
  const prime = useUi((s) => s.primeProducts);
  const key = slugs.join(',');
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);

  const missing = slugs.some((s) => !cache[s]);
  const needsFetch = hydrated && slugs.length > 0 && missing && fetchedKey !== key;

  useEffect(() => {
    if (!needsFetch) return;
    let live = true;
    loadProducts(key.split(','))
      .then((ps) => live && prime(ps))
      .finally(() => live && setFetchedKey(key));
    return () => {
      live = false;
    };
  }, [needsFetch, key, prime]);

  const products = useMemo(() => slugs.map((s) => cache[s]).filter((p): p is ProductCard => !!p), [slugs, cache]);
  const loading = !hydrated || needsFetch;
  return { products, loading };
}

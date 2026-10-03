'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadProducts } from '@/lib/actions/catalog';
import type { Product } from '@/lib/catalog/types';
import { useUi } from '@/stores/ui';

/**
 * Product data for slugs held on the device. Uses the in-memory cache for an
 * instant first paint; with `fresh`, always re-fetches so current prices and
 * stock win (cart and checkout).
 */
export function useProducts(slugs: string[], { fresh = false }: { fresh?: boolean } = {}) {
  const hydrated = useUi((s) => s.hydrated);
  const cache = useUi((s) => s.products);
  const prime = useUi((s) => s.primeProducts);
  const key = slugs.join(',');
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);

  const missing = slugs.some((s) => !cache[s]);
  const needsFetch = hydrated && slugs.length > 0 && (fresh ? fetchedKey !== key : missing);

  useEffect(() => {
    if (!needsFetch) return;
    let live = true;
    loadProducts(key.split(',')).then((ps) => {
      if (!live) return;
      prime(ps);
      setFetchedKey(key);
    });
    return () => {
      live = false;
    };
  }, [needsFetch, key, prime]);

  const products = useMemo(() => slugs.map((s) => cache[s]).filter((p): p is Product => !!p), [slugs, cache]);
  const loading = !hydrated || (slugs.length > 0 && (missing || (fresh && fetchedKey !== key && products.length === 0)));
  return { products, bySlug: cache, loading };
}

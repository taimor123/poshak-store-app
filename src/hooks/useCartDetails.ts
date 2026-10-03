'use client';
import { useMemo } from 'react';
import type { Product } from '@/lib/catalog/types';
import { cartCount, useCart, type CartLine } from '@/stores/cart';
import { useProducts } from './useProducts';

export type DetailedLine = CartLine & { index: number; product: Product; linePaisa: number; meta: string };

/**
 * Cart lines joined with current product data. Display-only maths: the
 * server re-prices everything when the order is placed.
 */
export function useCartDetails({ fresh = false }: { fresh?: boolean } = {}) {
  const lines = useCart((s) => s.lines);
  const slugs = useMemo(() => Array.from(new Set(lines.map((l) => l.slug))), [lines]);
  const { bySlug, loading } = useProducts(slugs, { fresh });

  const detailed = useMemo<DetailedLine[]>(
    () =>
      lines.flatMap((l, index) => {
        const product = bySlug[l.slug];
        if (!product) return [];
        return [{ ...l, index, product, linePaisa: product.pricePaisa * l.qty, meta: `${l.size ? 'Size ' + l.size : 'Unstitched'} · Qty ${l.qty}` }];
      }),
    [lines, bySlug],
  );

  return {
    lines: detailed,
    count: cartCount(lines),
    subtotalPaisa: detailed.reduce((a, l) => a + l.linePaisa, 0),
    loading,
  };
}

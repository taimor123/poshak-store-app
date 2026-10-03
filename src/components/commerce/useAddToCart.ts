'use client';
import { useCallback } from 'react';
import type { Product, Size } from '@/lib/catalog/types';
import { useCart } from '@/stores/cart';
import { toast, useUi } from '@/stores/ui';

/** Adds to cart, confirms with a toast and opens the mini-cart. */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const prime = useUi((s) => s.primeProducts);
  const setCartOpen = useUi((s) => s.setCartOpen);
  return useCallback(
    (p: Product, size: Size | null, qty: number) => {
      prime([p]);
      add(p.slug, size, qty);
      toast('Added to your cart. Shukriya!');
      setCartOpen(true);
    },
    [add, prime, setCartOpen],
  );
}

'use client';
import { useCallback, useState } from 'react';
import { addToCart } from '@/lib/actions/cart';
import type { ProductCard } from '@/lib/catalog/types';
import { useCart } from '@/stores/cart';
import { toast, useUi } from '@/stores/ui';

/** Adds a variant to the server cart, confirms with a toast and opens the mini-cart. */
export function useAddToCart() {
  const setCart = useCart((s) => s.setCart);
  const prime = useUi((s) => s.primeProducts);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const [pending, setPending] = useState(false);

  const add = useCallback(
    async (p: ProductCard, variantId: string, qty: number) => {
      setPending(true);
      try {
        const r = await addToCart(variantId, qty);
        if (!r.ok) {
          toast(r.error.code === 'STOCK_CONFLICT' ? 'Sorry, that just sold out.' : r.error.code === 'VARIANT_GONE' ? 'This piece is no longer available.' : r.error.message);
          return false;
        }
        prime([p]);
        setCart(r.data.cart);
        toast(r.data.clamped ? 'Added what we have in stock to your cart.' : 'Added to your cart. Shukriya!');
        setCartOpen(true);
        return true;
      } finally {
        setPending(false);
      }
    },
    [prime, setCart, setCartOpen],
  );
  return { add, pending };
}

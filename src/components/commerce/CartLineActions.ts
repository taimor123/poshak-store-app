'use client';
import { useState } from 'react';
import { removeCartLine, setCartQty } from '@/lib/actions/cart';
import type { CartLine } from '@/lib/orders/types';
import { useCart } from '@/stores/cart';
import { toast } from '@/stores/ui';

/** Quantity / remove actions on server cart lines, with a per-line pending flag. */
export function useCartLineActions() {
  const setCart = useCart((s) => s.setCart);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (lineId: string, op: () => ReturnType<typeof setCartQty>, done?: string) => {
    setBusy(lineId);
    try {
      const r = await op();
      if (r.ok) {
        setCart(r.data);
        if (done) toast(done);
      } else toast(r.error.message);
    } finally {
      setBusy(null);
    }
  };

  return {
    busy,
    setQty: (l: CartLine, qty: number) => run(l.id, () => setCartQty(l.id, qty)),
    remove: (l: CartLine) => run(l.id, () => removeCartLine(l.id), 'Removed from your cart'),
  };
}

/** Human text for a line's revalidation notices (CART_FLOW.md §Pricing & validation). */
export function lineNotice(l: CartLine): string | null {
  if (l.status === 'removed') return 'No longer available — please remove it.';
  if (l.status === 'out_of_stock') return 'Sold out — please remove it.';
  if (l.notices.includes('clamped')) return `Only ${l.available} available, so we’ve updated the quantity.`;
  if (l.notices.includes('price_up')) return 'The price has gone up since you added this.';
  if (l.notices.includes('price_down')) return 'Good news: the price has dropped.';
  return null;
}

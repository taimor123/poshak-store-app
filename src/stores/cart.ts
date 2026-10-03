'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storeConfig } from '@/config/store';
import type { Size } from '@/lib/catalog/types';
import { persistOptions } from './persist';

// Guest cart, persisted on this device. When the API cart ships, the server
// cart becomes the truth and this store only mirrors it (FRONTEND_ARCHITECTURE.md).
// The cart holds no prices: they're looked up fresh every time it's shown.

export type CartLine = { slug: string; size: Size | null; qty: number };

type CartState = {
  lines: CartLine[];
  add: (slug: string, size: Size | null, qty: number) => void;
  setQty: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
};

const clampQty = (n: number) => Math.max(1, Math.min(storeConfig.maxQtyPerLine, n));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, size, qty) =>
        set(({ lines }) => {
          const i = lines.findIndex((l) => l.slug === slug && l.size === size);
          if (i < 0) return { lines: [...lines, { slug, size, qty: clampQty(qty) }] };
          return { lines: lines.map((l, k) => (k === i ? { ...l, qty: clampQty(l.qty + qty) } : l)) };
        }),
      setQty: (index, qty) => set(({ lines }) => ({ lines: lines.map((l, k) => (k === index ? { ...l, qty: clampQty(qty) } : l)) })),
      remove: (index) => set(({ lines }) => ({ lines: lines.filter((_, k) => k !== index) })),
      clear: () => set({ lines: [] }),
    }),
    persistOptions<CartState>('cart'),
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty, 0);

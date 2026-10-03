'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlacedOrder } from '@/lib/orders/types';
import { persistOptions } from './persist';

// Per-device shopper state: wishlist, recently viewed, demo session, last order.

const RECENT_MAX = 8;

type ShopperState = {
  wishlist: string[];
  toggleWish: (slug: string) => boolean;

  viewed: string[];
  markViewed: (slug: string) => void;
  clearViewed: () => void;

  /** Demo phone-OTP session. Replaced by the API's session cookie later. */
  session: { phone: string } | null;
  signIn: (phone: string) => void;
  signOut: () => void;

  lastOrder: PlacedOrder | null;
  saveOrder: (o: PlacedOrder) => void;
};

export const useShopper = create<ShopperState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWish: (slug) => {
        const added = !get().wishlist.includes(slug);
        set(({ wishlist }) => ({ wishlist: added ? [slug, ...wishlist] : wishlist.filter((x) => x !== slug) }));
        return added;
      },

      viewed: [],
      markViewed: (slug) => set(({ viewed }) => ({ viewed: [slug, ...viewed.filter((x) => x !== slug)].slice(0, RECENT_MAX) })),
      clearViewed: () => set({ viewed: [] }),

      session: null,
      signIn: (phone) => set({ session: { phone } }),
      signOut: () => set({ session: null }),

      lastOrder: null,
      saveOrder: (lastOrder) => set({ lastOrder }),
    }),
    persistOptions<ShopperState>('shopper'),
  ),
);

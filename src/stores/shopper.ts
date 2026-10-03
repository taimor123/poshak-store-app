'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from '@/lib/api/account';
import { persistOptions } from './persist';

// Per-device shopper state: wishlist and recently viewed (slugs only — product
// data is always fetched fresh). The session is read from the API, not stored.

const RECENT_MAX = 8;

type ShopperState = {
  wishlist: string[];
  toggleWish: (slug: string) => boolean;

  viewed: string[];
  markViewed: (slug: string) => void;
  clearViewed: () => void;

  /** Signed-in user, from GET /auth/session. Not persisted. */
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
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

      user: null,
      setUser: (user) => set({ user }),
    }),
    { ...persistOptions<ShopperState>('shopper'), partialize: (s) => ({ wishlist: s.wishlist, viewed: s.viewed }) },
  ),
);

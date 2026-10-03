'use client';
import { create } from 'zustand';
import type { ProductCard } from '@/lib/catalog/types';

// Ephemeral UI state only (never persisted).

type UiState = {
  /** True once persisted stores have loaded from localStorage. */
  hydrated: boolean;
  setHydrated: () => void;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  toast: string | null;
  showToast: (msg: string) => void;

  /** Product display data fetched for cart / wishlist / recently viewed. */
  products: Record<string, ProductCard>;
  primeProducts: (ps: ProductCard[]) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>()((set) => ({
  hydrated: false,
  setHydrated: () => set({ hydrated: true }),

  cartOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),

  toast: null,
  showToast: (toast) => {
    set({ toast });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2000);
  },

  products: {},
  primeProducts: (ps) => set(({ products }) => ({ products: { ...products, ...Object.fromEntries(ps.map((p) => [p.slug, p])) } })),
}));

/** Shorthand for components that only need to fire a toast. */
export const toast = (msg: string) => useUi.getState().showToast(msg);

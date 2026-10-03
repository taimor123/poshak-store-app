'use client';
import { create } from 'zustand';
import { getCart } from '@/lib/actions/cart';
import { EMPTY_CART, type Cart } from '@/lib/orders/types';

// Mirror of the server cart (FRONTEND_ARCHITECTURE.md §Data flow: the API cart
// is the truth). Holds the last cart the API returned; never persisted.

type CartState = {
  cart: Cart;
  loaded: boolean;
  setCart: (cart: Cart) => void;
};

export const useCart = create<CartState>()((set) => ({
  cart: EMPTY_CART,
  loaded: false,
  setCart: (cart) => set({ cart, loaded: true }),
}));

/** Re-reads the cart from the API (full revalidation: current prices, stock clamps). */
export async function refreshCart() {
  useCart.getState().setCart(await getCart());
}

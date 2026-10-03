'use server';
import { api } from '@/lib/api/client';
import type { ApiResult } from '@/lib/api/envelope';
import { EMPTY_CART, type Cart } from '@/lib/orders/types';

// Thin proxies to the API cart (guest anon cookie or signed-in user). No business logic.

export async function getCart(): Promise<Cart> {
  const r = await api<Cart>('/cart', { auth: true });
  return r.ok ? r.data : EMPTY_CART;
}

export async function addToCart(variantId: string, qty: number): Promise<ApiResult<{ cart: Cart; clamped: boolean }>> {
  return api('/cart/lines', { method: 'POST', body: { variantId, qty }, auth: true, setCookies: true });
}

export async function setCartQty(lineId: string, qty: number): Promise<ApiResult<Cart>> {
  return api(`/cart/lines/${encodeURIComponent(lineId)}`, { method: 'PATCH', body: { qty }, auth: true, setCookies: true });
}

export async function removeCartLine(lineId: string): Promise<ApiResult<Cart>> {
  return api(`/cart/lines/${encodeURIComponent(lineId)}`, { method: 'DELETE', auth: true, setCookies: true });
}

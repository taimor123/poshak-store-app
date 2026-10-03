'use server';
import { api } from '@/lib/api/client';
import type { ApiResult } from '@/lib/api/envelope';
import type { OrderView, PlacedOrder } from '@/lib/orders/types';

// Thin proxies to the API. The API prices the order and re-validates everything.

export type CheckoutPayload = {
  contact: { email: string; phone: string };
  address: { name: string; line1: string; city: string; notes?: string };
  deliveryMethod: 'STANDARD' | 'EXPRESS';
  clientTotalPaisa: number;
};

export async function placeOrder(payload: CheckoutPayload, idempotencyKey: string): Promise<ApiResult<PlacedOrder>> {
  return api('/orders', {
    method: 'POST',
    body: { ...payload, paymentMethod: 'COD' },
    headers: { 'Idempotency-Key': idempotencyKey },
    auth: true,
    setCookies: true,
  });
}

/** Guest tracking by order number + mobile. */
export async function trackOrder(orderNo: string, phone: string): Promise<ApiResult<OrderView>> {
  return api('/orders/track', { method: 'POST', body: { orderNo, phone } });
}

export async function cancelOrder(orderNo: string, reason: string, token?: string): Promise<ApiResult<OrderView>> {
  return api(`/orders/${encodeURIComponent(orderNo)}/cancel`, { method: 'POST', body: { reason }, query: { t: token }, auth: true });
}

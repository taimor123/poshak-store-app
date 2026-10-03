import 'server-only';
import { cache } from 'react';
import type { OrderView } from '@/lib/orders/types';
import { api } from './client';

// Per-request reads that depend on the shopper's cookies (never cached).

export type SessionUser = { id: string; name: string; email: string; role: 'CUSTOMER' | 'ADMIN' };
export type Address = { id: string; name: string; phone: string; line1: string; city: string; province: string | null; postalCode: string | null; notes: string | null; isDefault: boolean };

/** The only session accessor (AUTHENTICATION.md §Implementation notes). Deduped per request. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const r = await api<{ user: SessionUser | null }>('/auth/session', { auth: true });
  return r.ok ? r.data.user : null;
});

export async function getMyOrders(): Promise<OrderView[]> {
  const r = await api<{ items: OrderView[] }>('/orders', { auth: true, query: { limit: 20 } });
  return r.ok ? r.data.items : [];
}

export async function getAddresses(): Promise<Address[]> {
  const r = await api<Address[]>('/account/addresses', { auth: true });
  return r.ok ? r.data : [];
}

/** Owner, or a guest holding the order's token. null when not found / not allowed. */
export async function getOrder(orderNo: string, token?: string): Promise<OrderView | null> {
  const r = await api<OrderView>(`/orders/${encodeURIComponent(orderNo)}`, { auth: true, query: { t: token } });
  return r.ok ? r.data : null;
}

import 'server-only';
import { MOCK_ACCOUNT, MOCK_ADDRESS, mockOrderHistory } from '@/lib/mock/orders';

// Account reads. Swap for GET /api/v1/me, /me/orders, /me/addresses later.

export async function getAccount() {
  return MOCK_ACCOUNT;
}

export async function getOrderHistory() {
  return mockOrderHistory();
}

export async function getAddresses() {
  return [MOCK_ADDRESS];
}

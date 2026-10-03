import { storeConfig } from '@/config/store';

// Display-side shipping estimate. The API recomputes the real charge at
// checkout; the client never decides what the customer pays.

export type DeliveryMethod = 'standard' | 'express';

export const isExpressCity = (city: string) => (storeConfig.expressCities as readonly string[]).includes(city);

export function shippingFor(subtotalPaisa: number, method: DeliveryMethod): number {
  if (method === 'express') return storeConfig.expressShippingPaisa;
  return subtotalPaisa >= storeConfig.freeShippingMinPaisa ? 0 : storeConfig.standardShippingPaisa;
}

export const deliveryDays = (method: DeliveryMethod) => (method === 'express' ? storeConfig.expressDays : storeConfig.standardDays);

export const deliveryLabel = (method: DeliveryMethod) => {
  const [a, b] = deliveryDays(method);
  return `${method === 'express' ? 'Express' : 'Standard'} · ${a}–${b} working days`;
};

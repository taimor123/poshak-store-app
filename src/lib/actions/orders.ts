'use server';
import { storeConfig } from '@/config/store';
import { getProductsBySlugs } from '@/lib/api/catalog';
import { mockOrderHistory } from '@/lib/mock/orders';
import { isStitched } from '@/lib/catalog/product';
import { deliveryRange } from '@/lib/format';
import type { CheckoutInput, OrderSummary, PlacedOrder } from '@/lib/orders/types';
import { deliveryDays, isExpressCity, shippingFor } from '@/lib/shipping';
import { PK_MOBILE } from '@/lib/validation';
import { fail, ok, type ApiResult } from '@/lib/api/envelope';

/**
 * Places a COD order. Today this prices the order from the demo catalogue;
 * later it forwards to POST /api/v1/orders with an idempotency key and returns
 * the API's envelope. Totals are always computed server-side.
 */
export async function placeOrder(input: CheckoutInput): Promise<ApiResult<PlacedOrder>> {
  if (input.name.trim().length < 2 || !PK_MOBILE.test(input.phone.trim()) || input.address.trim().length < 10 || !input.city)
    return fail('VALIDATION', 'Some details are missing. Check the highlighted fields.');
  if (!input.lines.length) return fail('VALIDATION', 'Your cart is empty.');

  const products = await getProductsBySlugs(input.lines.map((l) => l.slug));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lines: PlacedOrder['lines'] = [];
  for (const l of input.lines) {
    const p = bySlug.get(l.slug);
    if (!p) return fail('VARIANT_GONE', 'An item in your cart is no longer available.');
    if (isStitched(p) && !l.size) return fail('VALIDATION', `Choose a size for ${p.shortName}.`);
    const qty = Math.max(1, Math.min(storeConfig.maxQtyPerLine, Math.floor(l.qty)));
    lines.push({
      slug: p.slug,
      name: p.name,
      meta: `${l.size ? 'Size ' + l.size : 'Unstitched'} · Qty ${qty}`,
      swatch: p.swatch,
      linePaisa: p.pricePaisa * qty,
    });
  }

  const method = input.method === 'express' && isExpressCity(input.city) ? 'express' : 'standard';
  const subtotalPaisa = lines.reduce((a, l) => a + l.linePaisa, 0);
  const shippingPaisa = shippingFor(subtotalPaisa, method);
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

  return ok({
    orderNo: `${storeConfig.orderPrefix}-${yyyymm}-${String(1000 + Math.floor(Math.random() * 9000))}`,
    placedAt: now.toISOString(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    city: input.city,
    landmark: input.landmark.trim(),
    method,
    eta: deliveryRange(deliveryDays(method)),
    lines,
    subtotalPaisa,
    shippingPaisa,
    totalPaisa: subtotalPaisa + shippingPaisa,
  });
}

/** Guest tracking by order number + mobile. */
export async function trackOrder(orderNo: string, phone: string): Promise<ApiResult<OrderSummary>> {
  const no = orderNo.trim().toUpperCase().replace(/\s/g, '');
  if (!no || !PK_MOBILE.test(phone.trim())) return fail('VALIDATION', 'Enter your order number and the 11-digit mobile number you ordered with.');
  const hit = mockOrderHistory().find((o) => o.orderNo === no || o.orderNo.endsWith(no));
  if (!hit) return fail('NOT_FOUND', 'We couldn’t find that order. Check the number in your SMS, or message us on WhatsApp.');
  return ok(hit);
}

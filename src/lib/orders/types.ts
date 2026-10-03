import type { DeliveryMethod } from '@/lib/shipping';
import type { Size, Swatch } from '@/lib/catalog/types';

/** Customer-facing tracking steps (ORDER_LIFECYCLE.md, simplified). */
export const TRACKING_STEPS = ['Placed', 'Confirmed on WhatsApp', 'Dispatched', 'Out for delivery', 'Delivered'] as const;
export const DELIVERED_STEP = TRACKING_STEPS.length - 1;

/** Short status label for a pill. */
export const statusLabel = (step: number) => (step === 1 ? 'Confirmed' : TRACKING_STEPS[step]);

export type CheckoutInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  landmark: string;
  method: DeliveryMethod;
  lines: { slug: string; size: Size | null; qty: number }[];
};

/** Snapshot at placement: catalogue changes never touch placed orders. */
export type PlacedOrder = {
  orderNo: string;
  placedAt: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  landmark: string;
  method: DeliveryMethod;
  eta: string;
  lines: { slug: string; name: string; meta: string; swatch: Swatch; linePaisa: number }[];
  subtotalPaisa: number;
  shippingPaisa: number;
  totalPaisa: number;
};

/** A row in "Your orders" / guest tracking. */
export type OrderSummary = {
  orderNo: string;
  placedOn: string;
  itemCount: number;
  totalPaisa: number;
  summary: string;
  step: number;
  courier?: string;
  tracking?: string;
  stepDates: string[];
  next: string;
};

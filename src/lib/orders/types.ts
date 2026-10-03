// Cart + order DTOs from poshak-store-apis.

export type CartLine = {
  id: string;
  variantId: string;
  qty: number;
  status: 'ok' | 'removed' | 'out_of_stock';
  notices: ('clamped' | 'price_up' | 'price_down')[];
  unitPricePaisa: number;
  linePaisa: number;
  available: number;
  size: string | null;
  color: string | null;
  product: { slug: string; name: string; mode: string; colour: string | null; image: { url: string; alt: string } | null };
};

export type Cart = { id: string | null; lines: CartLine[]; count: number; subtotalPaisa: number; canCheckout: boolean; maxQtyPerLine: number };

export const EMPTY_CART: Cart = { id: null, lines: [], count: 0, subtotalPaisa: 0, canCheckout: false, maxQtyPerLine: 10 };

export type OrderStatus =
  | 'PENDING_PAYMENT' | 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED'
  | 'COMPLETED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED' | 'REFUNDED';

export type OrderView = {
  orderNo: string;
  status: OrderStatus;
  placedAt: string;
  deliveredAt: string | null;
  amounts: { subtotalPaisa: number; shippingPaisa: number; discountPaisa: number; totalPaisa: number };
  contact: { email: string; phone: string };
  shipping: { name: string; phone: string; line1: string; city: string; province: string | null; notes: string | null };
  courier: string | null;
  trackingNo: string | null;
  cancelReason: string | null;
  items: { id: string; productName: string; productSlug: string; sizeLabel: string | null; color: string | null; sku: string; unitPricePaisa: number; qty: number; imageUrl: string; linePaisa: number }[];
  timeline: { status: OrderStatus; at: string }[];
  payment: { method: string; status: string; amountPaisa: number } | null;
  canCancel: boolean;
  isGuest: boolean;
  guestToken?: string;
};

export type PlacedOrder = { orderNo: string; status: OrderStatus; totalPaisa: number; guestToken: string | null; replay: boolean };

/** Customer-facing tracking steps (ORDER_LIFECYCLE.md, simplified). */
export const TRACKING_STEPS = ['Placed', 'Confirmed on WhatsApp', 'Dispatched', 'Out for delivery', 'Delivered'] as const;
export const DELIVERED_STEP = TRACKING_STEPS.length - 1;

/** API status → step on the 5-step customer timeline (−1 for cancelled). */
export function trackingStep(status: OrderStatus): number {
  switch (status) {
    case 'PENDING':
    case 'PENDING_PAYMENT':
      return 0;
    case 'CONFIRMED':
    case 'PACKED':
      return 1;
    case 'SHIPPED':
      return 2;
    case 'DELIVERED':
    case 'COMPLETED':
    case 'RETURN_REQUESTED':
    case 'RETURNED':
    case 'REFUNDED':
      return 4;
    default:
      return -1;
  }
}

/** Dates for each reached step, from the order's event timeline. */
export function stepDates(o: Pick<OrderView, 'timeline'>): string[] {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Karachi' });
  const at = (s: OrderStatus[]) => o.timeline.find((t) => s.includes(t.status))?.at;
  return [at(['PENDING', 'PENDING_PAYMENT']), at(['CONFIRMED']), at(['SHIPPED']), at(['SHIPPED']), at(['DELIVERED'])].map((d) => (d ? fmt(d) : ''));
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Awaiting payment',
  PENDING: 'Placed',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Dispatched',
  DELIVERED: 'Delivered',
  COMPLETED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return requested',
  RETURNED: 'Returned',
  REFUNDED: 'Refunded',
};

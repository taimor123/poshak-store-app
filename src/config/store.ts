/**
 * Display defaults for business numbers. Money is integer paisa (PKR × 100).
 *
 * The real values live in the API's StoreConfig (admin-editable) and reach the
 * storefront through GET /config/public — see lib/api/catalog.ts
 * `getPublicConfig()`. These are used only as fallbacks if the API is
 * unreachable, and for copy that has no API field yet.
 */
export const storeConfig = {
  currency: 'PKR',

  freeShippingMinPaisa: 5_000_00,
  standardShippingPaisa: 250_00,
  expressShippingPaisa: 450_00,
  /** Typical standard delivery window (working days), for "Arrives …" copy. */
  standardDays: [2, 5] as [number, number],

  lowStockThreshold: 3,
  maxQtyPerLine: 10,
  returnWindowDays: 7,

  /** Cash on delivery is the only payment method at launch. */
  cardPaymentsLive: false,
} as const;

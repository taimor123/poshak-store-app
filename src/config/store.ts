/**
 * Business rules shown in the UI. Money is integer paisa (PKR × 100).
 *
 * These mirror `StoreConfig` in the API (docs/DATABASE/DATABASE_SCHEMA.md).
 * Until the storefront reads StoreConfig from the API, change them here —
 * never hard-code these numbers in components.
 */
export const storeConfig = {
  currency: 'PKR',

  freeShippingMinPaisa: 5_000_00,
  standardShippingPaisa: 250_00,
  expressShippingPaisa: 450_00,
  expressCities: ['Karachi', 'Lahore', 'Islamabad'],
  cities: [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
    'Peshawar', 'Hyderabad', 'Quetta', 'Sialkot', 'Gujranwala', 'Other',
  ],
  standardDays: [2, 5] as [number, number],
  expressDays: [1, 2] as [number, number],

  /** "Only N left" appears only when stock is genuinely at or below this. */
  lowStockThreshold: 3,
  maxQtyPerLine: 5,
  returnWindowDays: 7,

  /** Order numbers: PSK-YYYYMM-NNNN. */
  orderPrefix: 'PSK',

  /** Cash on delivery is the only payment method at launch. */
  cardPaymentsLive: false,
} as const;

// DTOs returned by poshak-store-apis (this repo's copy of the contract in
// docs/BACKEND/API_ENDPOINTS.md). Money is integer paisa.

export type SizeMode = 'STITCHED' | 'UNSTITCHED' | 'NONE';

/** Placeholder fabric tone; maps to a --color-fabric-* token until real photos exist. */
export type Swatch = 'mustard' | 'teapink' | 'emerald' | 'rust' | 'sage' | 'deepblue';

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  code: string;
  mode: SizeMode;
  category: { slug: string; name: string };
  parentCategory: { slug: string; name: string } | null;
  pricePaisa: number;
  compareAtPaisa: number | null;
  badge: 'NEW' | 'SALE' | null;
  fabric: string | null;
  colour: string | null;
  image: { url: string; alt: string } | null;
  stock: { total: number; low: boolean };
  sizes: { label: string; stock: number; variantId: string }[];
  variantId: string | null;
  publishedAt: string | null;
};

export type SizeChart = {
  chartName: string;
  dimensions: string[];
  rows: { size: string; values: Record<string, number | null> }[];
  fitNote: string | null;
};

export type FabricContent = { piece: 'SHIRT' | 'DUPATTA' | 'TROUSER'; detail: string | null; fabric: string; lengthMeters: number; lengthYards: number };

export type ProductDetail = ProductCard & {
  description: string;
  fitNote: string | null;
  isFinalSale: boolean;
  images: { url: string; alt: string; isCover: boolean }[];
  attributes: Record<string, unknown>;
  variants: { id: string; sku: string; size: string | null; color: string | null; pricePaisa: number; available: number }[];
  sizeChart: SizeChart | null;
  fabricContents: FabricContent[];
  related: ProductCard[];
};

export type Facets = {
  fabric: { value: string; count: number }[];
  price: { value: string; label: string; count: number }[];
  size: { value: string; count: number }[];
  hasStitched: boolean;
};

export type Listing = { items: ProductCard[]; total: number; nextCursor: string | null; facets: Facets };

export type CategoryListing = Listing & {
  category: { slug: string; name: string; description: string | null; sizeMode: SizeMode };
  breadcrumbs: { slug: string; name: string }[];
  children: { slug: string; name: string }[];
};

export type CategoryNode = { id: string; slug: string; name: string; description: string | null; sizeMode: SizeMode; children: CategoryNode[] };

export type PublicConfig = {
  freeShippingThresholdPaisa: number;
  expressFeePaisa: number;
  lowStockThreshold: number;
  maxQtyPerLine: number;
  returnWindowDays: number;
  paymentMethods: string[];
};

export type ShippingZone = { city: string; feePaisa: number; estimateText: string; expressAvailable: boolean };

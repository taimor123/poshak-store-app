// Catalogue DTOs. Shaped for the UI; when the API is wired up, lib/api maps
// API responses onto these types so components don't change.

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type CategoryKey = 'unstitched' | 'rtw' | 'formals';
export type ListingKey = CategoryKey | 'new' | 'sale' | 'all';

/** Placeholder fabric tone; maps to a --color-fabric-* token. */
export type Swatch = 'mustard' | 'teapink' | 'emerald' | 'rust' | 'sage' | 'deepblue';

export type ProductStock =
  | { kind: 'pack'; qty: number } // unstitched: one default variant
  | { kind: 'sizes'; bySize: Record<Size, number> }; // stitched: per-size stock

export type Product = {
  slug: string;
  /** Style name, e.g. "Gulnar". */
  shortName: string;
  /** Style type, e.g. "Embroidered Lawn 3-Piece". */
  styleType: string;
  /** Full display name. */
  name: string;
  category: CategoryKey;
  sub: string;
  fabric: string;
  colour: string;
  swatch: Swatch;
  pricePaisa: number;
  compareAtPaisa?: number;
  badge?: 'New' | 'Sale';
  addedDaysAgo: number;
  /** Garment length in inches (stitched only). */
  lengthIn?: number;
  stock: ProductStock;
  description: string;
};

export type Category = {
  key: CategoryKey;
  name: string;
  fromPaisa: number;
  intro: string;
  swatch: Swatch;
  subs: { key: string; label: string }[];
};

/** Unstitched pack contents row. */
export type PackPiece = { piece: string; fabric: string; yards: number };

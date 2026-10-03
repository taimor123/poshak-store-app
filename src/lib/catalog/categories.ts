import type { Swatch } from './types';

/**
 * The storefront's curated view of the top-level categories: header menus,
 * home tiles and listing URLs. Keys and sub-category keys are the API's
 * category slugs. The full tree lives in the API (admin-managed); this list
 * changes only by code, like the header (CATEGORY_TAXONOMY.md §Header navigation).
 */

export type CategoryKey = 'unstitched' | 'ready-to-wear' | 'formals';
export type CollectionKey = 'new' | 'sale' | 'all';
export type ListingKey = CategoryKey | CollectionKey;

export type Category = {
  key: CategoryKey;
  name: string;
  fromPaisa: number;
  swatch: Swatch;
  subs: { key: string; label: string }[];
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  unstitched: {
    key: 'unstitched',
    name: 'Unstitched',
    fromPaisa: 3_450_00,
    swatch: 'emerald',
    subs: [
      { key: 'unstitched-3-piece', label: '3-Piece Suits' },
      { key: 'unstitched-2-piece', label: '2-Piece Suits' },
      { key: 'unstitched-1-piece', label: '1-Piece / Kurti Fabric' },
    ],
  },
  'ready-to-wear': {
    key: 'ready-to-wear',
    name: 'Ready to Wear',
    fromPaisa: 2_450_00,
    swatch: 'teapink',
    subs: [
      { key: 'rtw-kurtis', label: 'Kurtis' },
      { key: 'rtw-2-piece', label: '2-Piece Suits' },
      { key: 'rtw-3-piece', label: '3-Piece Suits' },
      { key: 'rtw-co-ords', label: 'Co-ord Sets' },
      { key: 'rtw-trousers', label: 'Trousers & Shalwars' },
      { key: 'rtw-dupattas', label: 'Dupattas & Shawls' },
    ],
  },
  formals: {
    key: 'formals',
    name: 'Formals',
    fromPaisa: 9_800_00,
    swatch: 'deepblue',
    subs: [
      { key: 'formals-semi-formal', label: 'Semi-Formal' },
      { key: 'formals-luxury', label: 'Luxury Formal' },
      { key: 'formals-maxis', label: 'Maxis & Gowns' },
      { key: 'formals-lehenga', label: 'Lehenga Choli' },
      { key: 'formals-sarees', label: 'Sarees' },
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export const COLLECTIONS: Record<CollectionKey, { title: string; intro: string }> = {
  new: { title: 'New in', intro: 'The latest arrivals, newest first.' },
  sale: { title: 'Sale', intro: 'Reduced prices on remaining stock. The quantities shown are what we actually have.' },
  all: { title: 'All clothing', intro: 'Unstitched, ready to wear and formals in one place.' },
};

export const isCategoryKey = (k: string): k is CategoryKey => k in CATEGORIES;
export const isCollectionKey = (k: string): k is CollectionKey => k in COLLECTIONS;
export const isListingKey = (k: string): k is ListingKey => isCategoryKey(k) || isCollectionKey(k);

/** Path of a sub-category under its top-level category, e.g. "ready-to-wear/rtw-kurtis". */
export function categoryPath(key: CategoryKey, sub?: string | null) {
  // Trousers and dupattas sit one level deeper in the tree; the API resolves by the last slug.
  return sub ? `${key}/${sub}` : key;
}

/** Which top-level category a (sub-)category slug belongs to, for breadcrumbs and active nav. */
export function topLevelOf(slug: string | undefined | null): CategoryKey | null {
  if (!slug) return null;
  if (isCategoryKey(slug)) return slug;
  return CATEGORY_KEYS.find((k) => CATEGORIES[k].subs.some((s) => s.key === slug) || slug.startsWith(k === 'ready-to-wear' ? 'rtw-' : `${k}-`)) ?? null;
}

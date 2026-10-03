import type { Category, CategoryKey, ListingKey } from './types';

// Category tree (admin-managed in the API later). The header menu is NOT
// built from this — it is code-curated in src/config/nav.ts.

export const CATEGORIES: Record<CategoryKey, Category> = {
  unstitched: {
    key: 'unstitched',
    name: 'Unstitched',
    fromPaisa: 3_450_00,
    swatch: 'emerald',
    intro: 'Lawn, cambric and khaddar suits with exact yardage listed for every piece, so your tailor knows what they’re working with.',
    subs: [
      { key: '3-piece', label: '3-Piece Suits' },
      { key: '2-piece', label: '2-Piece Suits' },
      { key: '1-piece', label: '1-Piece / Kurti Fabric' },
    ],
  },
  rtw: {
    key: 'rtw',
    name: 'Ready to Wear',
    fromPaisa: 2_450_00,
    swatch: 'teapink',
    intro: 'Stitched pret with real garment measurements in inches on every product.',
    subs: [
      { key: 'kurtis', label: 'Kurtis' },
      { key: '2-piece', label: '2-Piece Suits' },
      { key: '3-piece', label: '3-Piece Suits' },
      { key: 'co-ord', label: 'Co-ord Sets' },
      { key: 'trousers', label: 'Trousers & Shalwars' },
      { key: 'dupattas', label: 'Dupattas & Shawls' },
    ],
  },
  formals: {
    key: 'formals',
    name: 'Formals',
    fromPaisa: 9_800_00,
    swatch: 'deepblue',
    intro: 'Semi-formal to luxury, measured and described as plainly as our everyday pieces.',
    subs: [
      { key: 'semi-formal', label: 'Semi-Formal' },
      { key: 'luxury', label: 'Luxury Formal' },
      { key: 'maxis', label: 'Maxis & Gowns' },
      { key: 'lehenga', label: 'Lehenga Choli' },
      { key: 'sarees', label: 'Sarees' },
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export const LISTINGS: Record<ListingKey, { title: string; intro: string }> = {
  unstitched: { title: CATEGORIES.unstitched.name, intro: CATEGORIES.unstitched.intro },
  rtw: { title: CATEGORIES.rtw.name, intro: CATEGORIES.rtw.intro },
  formals: { title: CATEGORIES.formals.name, intro: CATEGORIES.formals.intro },
  new: { title: 'New in', intro: 'The latest arrivals, newest first.' },
  sale: { title: 'Sale', intro: 'Reduced prices on remaining stock. The quantities shown are what we actually have.' },
  all: { title: 'All clothing', intro: 'Unstitched, ready to wear and formals in one place.' },
};

export const LISTING_KEYS = Object.keys(LISTINGS) as ListingKey[];

export const isListingKey = (k: string): k is ListingKey => k in LISTINGS;
export const isCategoryKey = (k: string): k is CategoryKey => k in CATEGORIES;

export const subLabel = (c: CategoryKey, s: string) => CATEGORIES[c].subs.find((x) => x.key === s)?.label ?? '';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

export type Unit = 'in' | 'cm';
export const toUnit = (inches: number, unit: Unit) => (unit === 'cm' ? String(Math.round(inches * 2.54)) : String(inches));

/** Kameez / shirt garment measurements (inches, measured on the finished piece). */
export const SHIRT_COLUMNS = ['Chest', 'Waist', 'Hip', 'Shoulder', 'Sleeve'] as const;
export const SHIRT_CHART: Record<Size, number[]> = {
  XS: [36, 32, 40, 13.5, 21],
  S: [38, 34, 42, 14, 21.5],
  M: [40, 36, 44, 14.5, 22],
  L: [43, 39, 47, 15, 22.5],
  XL: [46, 42, 50, 15.5, 23],
};

/** Trousers: waist relaxed, hip, length, ankle (inches). */
export const TROUSER_COLUMNS = ['Waist (relaxed)', 'Hip', 'Length', 'Ankle'] as const;
export const TROUSER_CHART: Record<Size, number[]> = {
  XS: [26, 40, 37, 13],
  S: [28, 42, 37.5, 13.5],
  M: [30, 44, 38, 14],
  L: [32, 46, 38.5, 14.5],
  XL: [34, 48, 39, 15],
};

/** Standard unstitched pack yardage, for the size guide. */
export const PACK_YARDAGE: { pack: string; shirt: string; dupatta: string; trouser: string; total: string }[] = [
  { pack: '3-piece', shirt: '3 yd', dupatta: '2.5 yd', trouser: '2.5 yd', total: '8 yd' },
  { pack: '2-piece', shirt: '3 yd', dupatta: '—', trouser: '2.5 yd', total: '5.5 yd' },
  { pack: '1-piece', shirt: '3 yd', dupatta: '—', trouser: '—', total: '3 yd' },
];

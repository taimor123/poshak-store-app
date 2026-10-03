import type { ProductCard, Swatch } from './types';

export const isStitched = (p: Pick<ProductCard, 'mode'>) => p.mode === 'STITCHED';

/** Honest stock caption: only when genuinely low (the API decides "low") or zero. */
export function stockNote(p: Pick<ProductCard, 'stock'>): { text: string; tone: 'warning' | 'muted' } | null {
  if (p.stock.total === 0) return { text: 'Out of stock', tone: 'muted' };
  if (p.stock.low) return { text: `Only ${p.stock.total} left`, tone: 'warning' };
  return null;
}

/** "Ready to wear · Lawn · Mustard" */
export const metaLine = (p: Pick<ProductCard, 'mode' | 'fabric' | 'colour'>) =>
  [p.mode === 'STITCHED' ? 'Ready to wear' : p.mode === 'UNSTITCHED' ? 'Unstitched' : 'Free size', p.fabric, p.colour].filter(Boolean).join(' · ');

/** "Noor — Chikankari Kurti, Ivory" → ["Noor", "Chikankari Kurti, Ivory"] */
export const splitName = (name: string) => {
  const i = name.indexOf(' — ');
  return i < 0 ? [name, ''] : [name.slice(0, i), name.slice(i + 3)];
};

// Placeholder tone per colour name until real photography is uploaded.
const SWATCHES: [RegExp, Swatch][] = [
  [/mustard|yellow|gold|ochre/i, 'mustard'],
  [/pink|ivory|blush|peach|cream|white|rose/i, 'teapink'],
  [/emerald|green|bottle|teal/i, 'emerald'],
  [/rust|maroon|red|orange|brown|wine/i, 'rust'],
  [/blue|navy|indigo|black|grey|gray/i, 'deepblue'],
  [/sage|mint|olive/i, 'sage'],
];
export const swatchFor = (colour: string | null | undefined): Swatch => SWATCHES.find(([re]) => re.test(colour ?? ''))?.[1] ?? 'sage';
export const swatchVar = (s: Swatch) => `var(--color-fabric-${s})`;

const FINE_FABRICS = ['Silk', 'Organza', 'Chiffon', 'Raw silk', 'Jacquard', 'Net'];
export const careText = (fabric: string | null) =>
  (FINE_FABRICS.includes(fabric ?? '')
    ? 'Dry clean only. Store folded in a cotton bag, away from direct sun.'
    : 'Hand wash or gentle machine wash cold, separately. Dry in shade. Iron on the reverse at medium heat.') + (fabric ? ` Fabric: ${fabric.toLowerCase()}.` : '');

/** Size-chart column labels. */
const DIMENSION_LABELS: Record<string, string> = {
  chest: 'Chest', waist: 'Waist', hip: 'Hip', shoulder: 'Shoulder', sleeve: 'Sleeve', length: 'Length',
  bust: 'Bust', flare: 'Flare', ankle: 'Ankle',
};
export const dimensionLabel = (key: string) => DIMENSION_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

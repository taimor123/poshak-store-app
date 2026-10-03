import { storeConfig } from '@/config/store';
import { SIZES } from './sizes';
import type { PackPiece, Product, Size, Swatch } from './types';

export const isStitched = (p: Product) => p.stock.kind === 'sizes';

export const totalStock = (p: Product) =>
  p.stock.kind === 'pack' ? p.stock.qty : SIZES.reduce((a, z) => a + (p.stock as { bySize: Record<Size, number> }).bySize[z], 0);

export const sizeStock = (p: Product, z: Size) => (p.stock.kind === 'pack' ? p.stock.qty : p.stock.bySize[z]);

export const isLowStock = (n: number) => n > 0 && n <= storeConfig.lowStockThreshold;

/** Honest stock caption: shown only when stock is genuinely low or zero. */
export function stockNote(p: Product): { text: string; tone: 'warning' | 'muted' } | null {
  const t = totalStock(p);
  if (t === 0) return { text: 'Out of stock', tone: 'muted' };
  if (isLowStock(t)) return { text: `Only ${t} left`, tone: 'warning' };
  return null;
}

/** "Ready to wear · Lawn · Mustard" */
export const metaLine = (p: Product) => [isStitched(p) ? 'Ready to wear' : 'Unstitched', p.fabric, p.colour].join(' · ');

export const swatchVar = (s: Swatch) => `var(--color-fabric-${s})`;

const FINE_FABRICS = ['Silk', 'Organza', 'Chiffon', 'Raw silk', 'Jacquard'];
export const careText = (p: Product) =>
  (FINE_FABRICS.includes(p.fabric)
    ? 'Dry clean only. Store folded in a cotton bag, away from direct sun.'
    : 'Hand wash or gentle machine wash cold, separately. Dry in shade. Iron on the reverse at medium heat.') +
  ` Fabric: ${p.fabric.toLowerCase()}.`;

/** Unstitched pack contents. (From the API's product attributes later.) */
export function packPieces(p: Product): PackPiece[] {
  const f = p.fabric.toLowerCase();
  const khaddar = f === 'khaddar';
  const embroidered = /Embroidered/.test(p.styleType);
  if (p.sub === '3-piece')
    return [
      { piece: 'Shirt front', fabric: (embroidered ? 'Embroidered ' : 'Printed ') + f, yards: 1.25 },
      { piece: 'Shirt back & sleeves', fabric: 'Printed ' + f, yards: 1.75 },
      { piece: 'Dupatta', fabric: khaddar ? 'Printed wool-blend shawl' : 'Printed chiffon', yards: 2.5 },
      { piece: 'Trouser', fabric: khaddar ? 'Dyed khaddar' : 'Dyed cambric', yards: 2.5 },
    ];
  if (p.sub === '2-piece')
    return [
      { piece: 'Shirt', fabric: 'Printed ' + f, yards: 3 },
      { piece: 'Trouser', fabric: 'Dyed cambric', yards: 2.5 },
    ];
  return [{ piece: 'Shirt', fabric: 'Printed ' + f, yards: 3 }];
}

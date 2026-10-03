import { dimensionLabel } from '@/lib/catalog/product';
import { SHIRT_CHART, SHIRT_COLUMNS, SIZES, TROUSER_CHART, TROUSER_COLUMNS, toUnit, type Unit } from '@/lib/catalog/sizes';
import type { FabricContent, SizeChart } from '@/lib/catalog/types';
import { Table } from '@/components/ui/Table';

const withUnit = (cols: readonly string[], unit: Unit) => cols.map((c) => ({ label: `${c} (${unit})` }));

/**
 * A product's resolved size chart from the API (category chart + this product's
 * overrides — the shopper never sees the mechanism). Highlights the chosen size.
 */
export function ResolvedChart({ chart, unit, selected }: { chart: SizeChart; unit: Unit; selected?: string | null }) {
  const cols = [{ label: 'Size' }, ...withUnit(chart.dimensions.map(dimensionLabel), unit)];
  const rows = chart.rows.map((r) => [r.size, ...chart.dimensions.map((d) => (r.values[d] == null ? '—' : toUnit(r.values[d]!, unit)))]);
  const idx = chart.rows.findIndex((r) => r.size === selected);
  return <Table columns={cols} rows={rows} highlight={idx >= 0 ? idx : undefined} />;
}

/** Generic shirt chart for the size guide page. */
export function ShirtChart({ unit }: { unit: Unit }) {
  const cols = [{ label: 'Size' }, ...withUnit(SHIRT_COLUMNS, unit)];
  return <Table columns={cols} rows={SIZES.map((z) => [z, ...SHIRT_CHART[z].map((v) => toUnit(v, unit))])} />;
}

/** Generic trouser chart for the size guide page. */
export function TrouserChart({ unit }: { unit: Unit }) {
  const cols = [{ label: 'Size' }, ...withUnit(TROUSER_COLUMNS, unit)];
  return <Table columns={cols} rows={SIZES.map((z) => [z, ...TROUSER_CHART[z].map((v) => toUnit(v, unit))])} />;
}

const PIECE: Record<FabricContent['piece'], string> = { SHIRT: 'Shirt', DUPATTA: 'Dupatta', TROUSER: 'Trouser' };

/** Unstitched "What's in the pack" table (lengths in yards, as tailors buy them). */
export function PackContentsTable({ pieces }: { pieces: FabricContent[] }) {
  return (
    <Table
      columns={[{ label: 'Piece' }, { label: 'Fabric', wrap: true }, { label: 'Length', align: 'right' }]}
      rows={pieces.map((p) => [p.detail ?? PIECE[p.piece], p.fabric, `${p.lengthYards} yd`])}
      footer={['Total', '', `${pieces.reduce((a, x) => a + x.lengthYards, 0)} yd`]}
    />
  );
}

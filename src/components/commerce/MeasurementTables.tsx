import { SHIRT_CHART, SHIRT_COLUMNS, SIZES, TROUSER_CHART, TROUSER_COLUMNS, toUnit, type Unit } from '@/lib/catalog/sizes';
import type { PackPiece, Size } from '@/lib/catalog/types';
import { Table } from '@/components/ui/Table';

const withUnit = (cols: readonly string[], unit: Unit) => cols.map((c) => ({ label: `${c} (${unit})` }));

/** Shirt chart; pass `lengthIn` to add a per-product length column (graded ±0.5in per size). */
export function ShirtChart({ unit, lengthIn, selected }: { unit: Unit; lengthIn?: number; selected?: Size | null }) {
  const cols = [{ label: 'Size' }, ...withUnit(lengthIn != null ? [...SHIRT_COLUMNS, 'Length'] : SHIRT_COLUMNS, unit)];
  const rows = SIZES.map((z, i) => [z, ...SHIRT_CHART[z].map((v) => toUnit(v, unit)), ...(lengthIn != null ? [toUnit(lengthIn + (i - 2) * 0.5, unit)] : [])]);
  return <Table columns={cols} rows={rows} highlight={selected ? SIZES.indexOf(selected) : undefined} />;
}

export function TrouserChart({ unit, selected }: { unit: Unit; selected?: Size | null }) {
  const cols = [{ label: 'Size' }, ...withUnit(TROUSER_COLUMNS, unit)];
  const rows = SIZES.map((z) => [z, ...TROUSER_CHART[z].map((v) => toUnit(v, unit))]);
  return <Table columns={cols} rows={rows} highlight={selected ? SIZES.indexOf(selected) : undefined} />;
}

/** Unstitched "What's in the pack" table. */
export function PackContentsTable({ pieces }: { pieces: PackPiece[] }) {
  return (
    <Table
      columns={[{ label: 'Piece' }, { label: 'Fabric', wrap: true }, { label: 'Length', align: 'right' }]}
      rows={pieces.map((p) => [p.piece, p.fabric, `${p.yards} yd`])}
      footer={['Total', '', `${pieces.reduce((a, x) => a + x.yards, 0)} yd`]}
    />
  );
}

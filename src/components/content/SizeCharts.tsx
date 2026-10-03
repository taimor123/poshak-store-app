'use client';
import { useState } from 'react';
import type { Unit } from '@/lib/catalog/sizes';
import { Segmented } from '@/components/ui/Segmented';
import { ShirtChart, TrouserChart } from '@/components/commerce/MeasurementTables';

/** Shirt + trouser charts with a shared inches/cm toggle. */
export function SizeCharts() {
  const [unit, setUnit] = useState<Unit>('in');
  return (
    <>
      <Segmented className="-mt-7 self-start" label="Units" value={unit} onChange={setUnit} options={[{ value: 'in', label: 'Inches' }, { value: 'cm', label: 'cm' }]} />
      <section aria-labelledby="k-h" className="flex flex-col gap-3">
        <h2 id="k-h" className="h-section">
          Kameez, kurtis &amp; shirts
        </h2>
        <ShirtChart unit={unit} />
        <p className="m-0 text-caption text-ink-2">Lengths vary by style and are listed on each product page.</p>
      </section>
      <section aria-labelledby="t-h" className="flex flex-col gap-3">
        <h2 id="t-h" className="h-section">
          Trousers &amp; shalwars
        </h2>
        <TrouserChart unit={unit} />
      </section>
    </>
  );
}

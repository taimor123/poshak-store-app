import { PACK_YARDAGE } from '@/lib/catalog/sizes';
import { InfoCard, PageHeading } from '@/components/ui/Blocks';
import { Table } from '@/components/ui/Table';
import { HelpPanel } from '@/components/content/HelpPanel';
import { SizeCharts } from '@/components/content/SizeCharts';

export const metadata = { title: 'Size guide' };

const HOW_TO_MEASURE = [
  ['Chest', 'Around the fullest part, tape level under the arms.'],
  ['Waist', 'Around the narrowest part, usually just above the navel.'],
  ['Hip', 'Around the fullest part, feet together.'],
  ['Shoulder', 'Across the back, from one shoulder seam to the other.'],
  ['Length', 'From the highest point of the shoulder down to where you want the hem.'],
];

export default function SizeGuidePage() {
  return (
    <div className="wrap pt-8">
      <div className="mx-auto flex max-w-[880px] flex-col gap-10">
        <PageHeading
          eyebrow="Measured, so it fits"
          title="Size guide"
          intro="These are garment measurements: the finished piece laid flat and measured all the way around. Compare them with a kurta you already like the fit of, or with your body measurements plus 2–3 inches of ease."
        />
        <SizeCharts />
        <section aria-labelledby="m-h" className="flex flex-col gap-3.5">
          <h2 id="m-h" className="h-section">
            How to measure yourself
          </h2>
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_TO_MEASURE.map(([title, body], i) => (
              <li key={title}>
                <InfoCard title={`${i + 1}. ${title}`}>{body}</InfoCard>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="u-h" className="flex flex-col gap-3">
          <h2 id="u-h" className="h-section">
            Unstitched fabric yardage
          </h2>
          <p className="m-0 max-w-[62ch] text-body text-ink-2">Every unstitched pack lists the exact length of each piece. Our standard packs fit sizes up to XL with a 42-inch shirt.</p>
          <Table
            columns={[{ label: 'Pack' }, { label: 'Shirt' }, { label: 'Dupatta' }, { label: 'Trouser' }, { label: 'Total' }]}
            rows={PACK_YARDAGE.map((r) => [r.pack, r.shirt, r.dupatta, r.trouser, r.total])}
          />
        </section>
        <HelpPanel title="Between sizes?">Send us your chest, waist and hip measurements on WhatsApp and we’ll suggest a size for the exact piece you’re looking at. We usually reply within an hour, 10am–8pm.</HelpPanel>
      </div>
    </div>
  );
}

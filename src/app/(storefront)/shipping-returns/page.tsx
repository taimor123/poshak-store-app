import { siteConfig } from '@/config/site';
import { storeConfig } from '@/config/store';
import { formatPKR } from '@/lib/format';
import { Accordion } from '@/components/ui/Accordion';
import { InfoCard, NumberedSteps, PageHeading } from '@/components/ui/Blocks';
import { Table } from '@/components/ui/Table';
import { HelpPanel } from '@/components/content/HelpPanel';

export const metadata = { title: 'Shipping & returns' };

const days = storeConfig.returnWindowDays;
const free = formatPKR(storeConfig.freeShippingMinPaisa);
const standard = formatPKR(storeConfig.standardShippingPaisa);
const express = formatPKR(storeConfig.expressShippingPaisa);
const expressCities = `${storeConfig.expressCities.slice(0, -1).join(', ')} and ${storeConfig.expressCities.at(-1)}`;

const FAQ = [
  { title: 'Can I open the parcel before paying?', body: `Most couriers don’t allow opening before payment. Check that the seal is intact; if anything inside is wrong, we’ll fix it under the ${days}-day policy.` },
  { title: 'Are sale items returnable?', body: 'Yes, on the same terms as full-price items.' },
  { title: 'What if my piece arrives damaged?', body: 'Send us a photo within 48 hours. We’ll replace it or refund you in full, including shipping.' },
  { title: 'Do you ship outside Pakistan?', body: 'Not yet. We’ll announce it here when we do.' },
];

export default function ShippingReturnsPage() {
  return (
    <div className="wrap pt-8">
      <div className="mx-auto flex max-w-[880px] flex-col gap-10">
        <PageHeading
          title="Shipping & returns"
          intro={`We ship from ${siteConfig.location.split(',')[0]} to every city in Pakistan. Pay in cash when your order arrives, and return anything that doesn’t work within ${days} days.`}
        />
        <section aria-labelledby="d-h" className="flex flex-col gap-3">
          <h2 id="d-h" className="h-section">
            Delivery times
          </h2>
          <Table
            columns={[{ label: 'Where' }, { label: 'Standard' }, { label: 'Express' }]}
            rows={[
              ['Karachi', '1–2 working days', 'Next working day'],
              ['Lahore, Islamabad', '2–3 working days', '1–2 working days'],
              ['Other cities', '3–5 working days', '—'],
              ['AJK, Gilgit-Baltistan, remote areas', '5–7 working days', '—'],
            ]}
          />
          <p className="m-0 text-caption text-ink-2">Orders confirmed before 2pm are dispatched the same day. Sundays and public holidays don’t count as working days.</p>
        </section>
        <section aria-labelledby="c-h" className="flex flex-col gap-3">
          <h2 id="c-h" className="h-section">
            Charges
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <InfoCard title="Standard">{`Free over ${free}. ${standard} below that.`}</InfoCard>
            <InfoCard title="Express">{`${express} on any order. ${expressCities}.`}</InfoCard>
            <InfoCard title="Cash on delivery">No extra fee. Keep the exact amount ready; riders may not carry change.</InfoCard>
          </div>
        </section>
        <section aria-labelledby="r-h" className="flex flex-col gap-3.5">
          <h2 id="r-h" className="h-section">
            Returns &amp; exchanges
          </h2>
          <p className="m-0 max-w-[62ch] text-[15px] leading-6 text-ink-2">
            You have {days} days from delivery. Stitched pieces must be unworn and unwashed with tags attached. Unstitched fabric must be uncut, in its original pack. Size exchanges are free once per order.
          </p>
          <NumberedSteps
            steps={[
              { title: 'Message us on WhatsApp', body: 'with your order number and what you’d like to return or exchange.' },
              { title: 'We book a free pickup', body: `in ${expressCities}. Elsewhere, send it by courier and we refund up to ${standard} of the cost.` },
              { title: 'You get your refund within 5 working days', body: 'of the parcel reaching us, by bank transfer, JazzCash or Easypaisa.' },
            ]}
          />
        </section>
        <section aria-labelledby="f-h">
          <h2 id="f-h" className="h-section mb-2">
            Common questions
          </h2>
          <Accordion items={FAQ} />
        </section>
        <HelpPanel inline cta="WhatsApp us">
          <strong className="font-semibold">Still unsure?</strong> We reply on WhatsApp within an hour, {siteConfig.contact.hours}.
        </HelpPanel>
      </div>
    </div>
  );
}

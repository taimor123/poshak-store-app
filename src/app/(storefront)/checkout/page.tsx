import { getPublicConfig, getShippingZones } from '@/lib/api/catalog';
import { CheckoutView } from '@/components/checkout/CheckoutView';

export const metadata = { title: 'Checkout', robots: { index: false } };

/** Single-page checkout by default; `?v=steps` shows the step-by-step layout. */
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const [{ v }, config, zones] = await Promise.all([searchParams, getPublicConfig(), getShippingZones()]);
  return (
    <CheckoutView
      key={v}
      layout={v === 'steps' ? 'steps' : 'single'}
      zones={zones}
      freeShippingThresholdPaisa={config.freeShippingThresholdPaisa}
      expressFeePaisa={config.expressFeePaisa}
      returnWindowDays={config.returnWindowDays}
    />
  );
}

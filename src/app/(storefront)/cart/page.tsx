import { getPublicConfig, getShippingZones } from '@/lib/api/catalog';
import { CartView } from '@/components/checkout/CartView';

export const metadata = { title: 'Cart', robots: { index: false } };

export default async function CartPage() {
  const [config, zones] = await Promise.all([getPublicConfig(), getShippingZones().catch(() => [])]);
  // Estimate with the lowest standard fee; it becomes final at checkout once the city is known.
  const standardFeePaisa = zones.length ? Math.min(...zones.map((z) => z.feePaisa)) : 250_00;
  return <CartView freeShippingThresholdPaisa={config.freeShippingThresholdPaisa} standardFeePaisa={standardFeePaisa} />;
}

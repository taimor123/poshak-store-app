import { CheckoutView } from '@/components/checkout/CheckoutView';

export const metadata = { title: 'Checkout' };

/** Single-page checkout by default; `?v=steps` shows the step-by-step layout. */
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { v } = await searchParams;
  return <CheckoutView key={v} layout={v === 'steps' ? 'steps' : 'single'} />;
}

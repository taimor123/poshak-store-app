import { notFound } from 'next/navigation';
import { routes } from '@/config/routes';
import { getOrder } from '@/lib/api/account';
import { ConfirmationView } from '@/components/checkout/ConfirmationView';

export const metadata = { title: 'Order placed', robots: { index: false } };

type Props = { searchParams: Promise<{ o?: string; t?: string }> };

/** /checkout/confirmation?o=PSK-…&t=<guest token> — owner or token holder only (the API enforces it). */
export default async function ConfirmationPage({ searchParams }: Props) {
  const { o, t } = await searchParams;
  const order = o ? await getOrder(o, t) : null;
  if (!order) notFound();
  return <ConfirmationView order={order} trackHref={routes.order(order.orderNo, t)} />;
}

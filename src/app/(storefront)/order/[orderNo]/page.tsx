import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/api/account';
import { OrderDetail } from '@/components/account/OrderDetail';

export const metadata = { title: 'Your order', robots: { index: false } };

type Props = { params: Promise<{ orderNo: string }>; searchParams: Promise<{ t?: string }> };

/** Order tracking: owner (session) or guest with the order's token (?t=). Anyone else sees a 404. */
export default async function OrderPage({ params, searchParams }: Props) {
  const [{ orderNo }, { t }] = await Promise.all([params, searchParams]);
  const order = await getOrder(orderNo, t);
  if (!order) notFound();
  return (
    <div className="wrap pt-8">
      <OrderDetail order={order} token={t} />
    </div>
  );
}

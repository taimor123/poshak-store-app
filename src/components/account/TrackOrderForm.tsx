'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { routes } from '@/config/routes';
import { trackOrder } from '@/lib/actions/orders';
import { STATUS_LABEL, type OrderView } from '@/lib/orders/types';
import { TextField } from '@/components/ui/Field';

/** Guest tracking: order number + the mobile it was placed with. No account needed. */
export function TrackOrderForm() {
  const [orderNo, setOrderNo] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [found, setFound] = useState<OrderView | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      if (!orderNo.trim() || !phone.trim()) {
        setFound(null);
        return setError('Enter your order number and the mobile number you ordered with.');
      }
      const res = await trackOrder(orderNo.trim(), phone.trim());
      if (res.ok) {
        setError('');
        setFound(res.data);
      } else {
        setFound(null);
        setError(res.error.code === 'VALIDATION' ? 'Enter the 11-digit mobile number you ordered with, like 0300 1234567.' : res.error.message);
      }
    });
  };

  return (
    <section role="tabpanel" aria-label="Track an order" className="mt-6 max-w-[520px]">
      <p className="mt-0 mb-4 text-body text-ink-2">No account needed. Use the order number from your confirmation SMS or email.</p>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField id="t-no" label="Order number" placeholder="PSK-202610-0001" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
        <TextField id="t-ph" label="Mobile number" type="tel" inputMode="numeric" placeholder="0300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Looking it up…' : 'Track order'}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-4 mb-0 text-ui font-medium text-sale">
          {error}
        </p>
      )}
      {found && (
        <div role="status" className="card-box mt-5 flex flex-col gap-1.5 px-5 py-[18px]">
          <span className="text-body font-semibold">
            {found.orderNo} · {STATUS_LABEL[found.status]}
          </span>
          {found.trackingNo && (
            <span className="text-ui text-ink-2">
              {found.courier} tracking {found.trackingNo}
            </span>
          )}
          <Link href={routes.order(found.orderNo, found.guestToken)} className="tlink self-start text-ui">
            See full tracking →
          </Link>
        </div>
      )}
    </section>
  );
}

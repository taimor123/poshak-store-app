'use client';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { DELIVERED_STEP, type OrderSummary } from '@/lib/orders/types';
import { useShopper } from '@/stores/shopper';
import { toast, useUi } from '@/stores/ui';
import { ButtonLink } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Blocks';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderCard } from './OrderCard';
import { TrackOrderForm } from './TrackOrderForm';

export type AccountTab = 'orders' | 'track' | 'addr';
type Address = { label: string; name: string; line: string; phone: string };

/**
 * Signed in: Orders / Track an order / Addresses. Signed out: a sign-in
 * prompt and guest tracking only.
 */
export function AccountView({ initialTab, account, history, addresses }: { initialTab: AccountTab; account: { name: string; email: string }; history: OrderSummary[]; addresses: Address[] }) {
  const hydrated = useUi((s) => s.hydrated);
  const session = useShopper((s) => s.session);
  const signOut = useShopper((s) => s.signOut);
  const lastOrder = useShopper((s) => s.lastOrder);
  const [tabState, setTab] = useState<AccountTab>(initialTab);
  const [openNo, setOpenNo] = useState<string | null>(null);

  const signedIn = hydrated && !!session;
  const tab: AccountTab = signedIn ? tabState : 'track';
  const tabs: [AccountTab, string][] = signedIn ? [['orders', 'Orders'], ['track', 'Track an order'], ['addr', 'Addresses']] : [['track', 'Track an order']];

  const orders: OrderSummary[] = [
    ...(lastOrder
      ? [{ orderNo: lastOrder.orderNo, placedOn: 'today', itemCount: lastOrder.lines.length, totalPaisa: lastOrder.totalPaisa, summary: lastOrder.lines.map((l) => l.name.split(' — ')[0]).join(', '), step: 0, stepDates: ['Today'], next: 'We’ll confirm on WhatsApp within 12 hours.' }]
      : []),
    ...history,
  ];

  if (!hydrated)
    return (
      <div className="wrap pt-8" aria-busy="true">
        <div className="mx-auto flex max-w-[880px] flex-col gap-3">
          <Skeleton className="h-10 w-[60%] rounded-btn" />
          <Skeleton className="mt-6 h-12 rounded-card" />
          <Skeleton className="h-[118px] rounded-card" />
        </div>
      </div>
    );

  return (
    <div className="wrap pt-8">
      <div className="mx-auto max-w-[880px]">
        {signedIn ? (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <h1 className="h-page m-0">Assalam o alaikum, {account.name.split(' ')[0]}</h1>
              <p className="m-0 text-ui text-ink-2">
                {account.email} · {session!.phone}
              </p>
            </div>
            <button type="button" className="tlink text-ui" onClick={() => { signOut(); toast('Signed out. Khuda hafiz!'); }}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3.5">
            <h1 className="h-page m-0">Your account</h1>
            <p className="m-0 max-w-[56ch] text-body text-ink-2">Sign in with your mobile number to see past orders, saved addresses and live tracking. No password needed.</p>
            <ButtonLink href={routes.signIn(routes.account())}>Sign in with mobile number</ButtonLink>
          </div>
        )}

        <div role="tablist" aria-label="Account sections" className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-line">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`min-h-12 px-3.5 text-body whitespace-nowrap ${tab === k ? 'font-semibold text-brand shadow-[inset_0_-2px_0_var(--color-brand)]' : 'font-medium text-ink-2'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <section role="tabpanel" aria-label="Orders" className="mt-6 flex animate-fadein flex-col gap-3">
            {orders.map((o, i) => {
              const open = openNo === null ? i === 0 && o.step < DELIVERED_STEP : openNo === o.orderNo;
              return <OrderCard key={o.orderNo} order={o} open={open} onToggle={() => setOpenNo(open ? '' : o.orderNo)} />;
            })}
          </section>
        )}

        {tab === 'track' && <TrackOrderForm />}

        {tab === 'addr' && (
          <section role="tabpanel" aria-label="Addresses" className="mt-6 grid gap-3 sm:grid-cols-2">
            {addresses.map((a, i) => (
              <div key={a.label} className="card-box flex flex-col gap-1 px-5 py-[18px] text-body">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{a.label}</span>
                  {i === 0 && <Pill>Default</Pill>}
                </div>
                <span>{a.name}</span>
                <span className="text-ink-2">{a.line}</span>
                <span className="text-ink-2">{a.phone}</span>
                <button type="button" className="tlink self-start text-ui" onClick={() => toast('Editing addresses is coming soon')}>
                  Edit
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary min-h-[120px] border-dashed" onClick={() => toast('Adding addresses is coming soon')}>
              + Add a new address
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

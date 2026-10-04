'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { signOut } from '@/lib/actions/auth';
import type { Address, SessionUser } from '@/lib/api/account';
import { DELIVERED_STEP, trackingStep, type OrderView } from '@/lib/orders/types';
import { formatPkPhone } from '@/lib/validation';
import { refreshCart } from '@/stores/cart';
import { useShopper } from '@/stores/shopper';
import { toast } from '@/stores/ui';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState, Pill } from '@/components/ui/Blocks';
import { OrderCard } from './OrderCard';
import { TrackOrderForm } from './TrackOrderForm';

export type AccountTab = 'orders' | 'track' | 'addr';

/**
 * Signed in: Orders / Track an order / Addresses. Signed out: a sign-in prompt
 * and guest tracking only. The server decides which (session from the API).
 */
export function AccountView({ initialTab, user, orders, addresses }: { initialTab: AccountTab; user: SessionUser | null; orders: OrderView[]; addresses: Address[] }) {
  const router = useRouter();
  const setUser = useShopper((s) => s.setUser);
  const [tabState, setTab] = useState<AccountTab>(initialTab);
  const [openNo, setOpenNo] = useState<string | null>(null);

  const tab: AccountTab = user ? tabState : 'track';
  const tabs: [AccountTab, string][] = user ? [['orders', 'Orders'], ['track', 'Track an order'], ['addr', 'Addresses']] : [['track', 'Track an order']];

  const doSignOut = async () => {
    await signOut();
    setUser(null);
    await refreshCart();
    toast('Signed out. Khuda hafiz!');
    router.refresh();
  };

  return (
    <div className="wrap pt-8">
      <div className="mx-auto max-w-[880px]">
        {user ? (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <h1 className="h-page m-0">Assalam o alaikum, {user.name.split(' ')[0]}</h1>
              <p className="m-0 text-ui text-ink-2">{user.email}</p>
            </div>
            <button type="button" className="tlink text-ui" onClick={doSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3.5">
            <h1 className="h-page m-0">Your account</h1>
            <p className="m-0 max-w-[56ch] text-body text-ink-2">Sign in to see past orders, saved addresses and live tracking.</p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={routes.signIn(routes.account())}>Sign in</ButtonLink>
              <ButtonLink variant="link" href={routes.register(routes.account())}>
                Create an account
              </ButtonLink>
            </div>
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
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" body="When you place an order, you’ll be able to track it here." action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>} />
            ) : (
              orders.map((o, i) => {
                const open = openNo === null ? i === 0 && trackingStep(o.status) >= 0 && trackingStep(o.status) < DELIVERED_STEP : openNo === o.orderNo;
                return <OrderCard key={o.orderNo} order={o} open={open} onToggle={() => setOpenNo(open ? '' : o.orderNo)} />;
              })
            )}
          </section>
        )}

        {tab === 'track' && <TrackOrderForm />}

        {tab === 'addr' && (
          <section role="tabpanel" aria-label="Addresses" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={a.id} className="card-box flex flex-col gap-1 px-5 py-[18px] text-body">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{a.name}</span>
                  {a.isDefault && <Pill>Default</Pill>}
                </div>
                <span className="text-ink-2">{[a.line1, a.notes, a.city].filter(Boolean).join(', ')}</span>
                <span className="text-ink-2">{formatPkPhone(a.phone)}</span>
              </div>
            ))}
            <button type="button" className="btn-secondary min-h-[120px] border-dashed" onClick={() => toast('Saving addresses from your account is coming soon')}>
              + Add a new address
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

import { getAddresses, getMyOrders, getSession } from '@/lib/api/account';
import { AccountView, type AccountTab } from '@/components/account/AccountView';

export const metadata = { title: 'Your account', robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initialTab: AccountTab = tab === 'track' ? 'track' : tab === 'addr' ? 'addr' : 'orders';
  const user = await getSession();
  const [orders, addresses] = user ? await Promise.all([getMyOrders(), getAddresses()]) : [[], []];
  return <AccountView key={`${initialTab}-${user?.id ?? 'guest'}`} initialTab={initialTab} user={user} orders={orders} addresses={addresses} />;
}

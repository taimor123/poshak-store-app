import { getAccount, getAddresses, getOrderHistory } from '@/lib/api/account';
import { AccountView, type AccountTab } from '@/components/account/AccountView';

export const metadata = { title: 'Your account' };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initialTab: AccountTab = tab === 'track' ? 'track' : tab === 'addr' ? 'addr' : 'orders';
  const [account, history, addresses] = await Promise.all([getAccount(), getOrderHistory(), getAddresses()]);
  return <AccountView key={initialTab} initialTab={initialTab} account={account} history={history} addresses={addresses} />;
}

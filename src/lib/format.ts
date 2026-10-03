import { storeConfig } from '@/config/store';

/** Integer paisa → "PKR 6,450". The only place money is formatted. Never decimals. */
export function formatPKR(paisa: number): string {
  return `${storeConfig.currency} ${Math.round(paisa / 100).toLocaleString('en-US')}`;
}

// Dates are computed and formatted in Pakistan time, so the server (UTC in
// production) and the shopper's browser always render the same text — no
// hydration mismatches around midnight.
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;
const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

/** "Today" in PKT, as a Date whose UTC fields hold the Pakistan calendar date. */
const pktToday = () => new Date(Date.now() + PKT_OFFSET_MS);

/** Working days skip Sunday. */
function addWorkingDays(n: number, from = pktToday()) {
  const d = new Date(from);
  let k = 0;
  while (k < n) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0) k++;
  }
  return d;
}

/** "Mon 6 Oct – Thu 9 Oct" */
export const deliveryRange = ([a, b]: readonly [number, number]) => `${fmtDate(addWorkingDays(a))} – ${fmtDate(addWorkingDays(b))}`;

export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;

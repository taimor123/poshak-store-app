import { storeConfig } from '@/config/store';

/** Integer paisa → "PKR 6,450". The only place money is formatted. Never decimals. */
export function formatPKR(paisa: number): string {
  return `${storeConfig.currency} ${Math.round(paisa / 100).toLocaleString('en-US')}`;
}

const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/** Working days skip Sunday. */
function addWorkingDays(n: number, from = new Date()) {
  const d = new Date(from);
  let k = 0;
  while (k < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) k++;
  }
  return d;
}

/** "Mon 6 Oct – Thu 9 Oct" */
export const deliveryRange = ([a, b]: readonly [number, number]) => `${fmtDate(addWorkingDays(a))} – ${fmtDate(addWorkingDays(b))}`;

export const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmtDate(d);
};

export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;

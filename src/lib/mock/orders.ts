import { daysAgo, deliveryRange } from '@/lib/format';
import type { OrderSummary } from '@/lib/orders/types';

// Demo order history for the signed-in demo account and guest tracking.
// Only lib/api/* and lib/actions/* may import this file.

export const MOCK_ACCOUNT = { name: 'Ayesha Khan', email: 'ayesha.khan@example.pk' };

export const MOCK_ADDRESS = {
  label: 'Home',
  name: 'Ayesha Khan',
  line: 'House 14, Street 6, Block 2, PECHS, near Tariq Road, Karachi',
  phone: '0300 1234567',
};

export const mockOrderHistory = (): OrderSummary[] => [
  {
    orderNo: 'PSK-202609-0297', placedOn: daysAgo(3), itemCount: 1, totalPaisa: 9_800_00, summary: 'Zeenat — Silk Co-ord Set, Emerald',
    step: 2, courier: 'TCS', tracking: '7739 2041 5521', stepDates: [daysAgo(3), daysAgo(3), daysAgo(2)],
    next: `Dispatched with TCS. Expected ${deliveryRange([1, 2])}.`,
  },
  {
    orderNo: 'PSK-202609-0164', placedOn: daysAgo(24), itemCount: 2, totalPaisa: 11_200_00, summary: 'Noor, Mahjabeen',
    step: 4, courier: 'Leopards', tracking: '4410 8823 0067', stepDates: [daysAgo(24), daysAgo(24), daysAgo(23), daysAgo(21), daysAgo(21)],
    next: `Delivered ${daysAgo(21)}.`,
  },
];

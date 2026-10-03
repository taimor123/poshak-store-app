import { storeConfig } from '@/config/store';
import { cn } from '@/lib/cn';

/**
 * Live stock line. Honest by design: "Only N left" appears only when stock is
 * genuinely at or below the store's low-stock threshold (StoreConfig).
 */
export function StockMessage({ left, size, prompt, inStockText, lowThreshold = storeConfig.lowStockThreshold }: { left: number; size?: string | null; prompt?: string; inStockText?: string; lowThreshold?: number }) {
  const [text, tone] =
    prompt != null
      ? [prompt, 'text-ink-2']
      : left === 0
        ? ['Out of stock', 'text-ink-2']
        : left <= lowThreshold
          ? [`Only ${left} left${size ? ' in ' + size : ''}`, 'text-warning']
          : [inStockText ?? (size ? `In stock in ${size}` : 'In stock'), 'text-success'];
  return (
    <p className={cn('m-0 text-ui font-medium', tone)} aria-live="polite">
      {text}
    </p>
  );
}

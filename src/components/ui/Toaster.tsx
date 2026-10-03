'use client';
import { useUi } from '@/stores/ui';

/** Dark pill, bottom-centre, auto-dismisses after 2s. Fire with `toast()` from stores/ui. */
export function Toaster() {
  const msg = useUi((s) => s.toast);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-100 -translate-x-1/2">
      {msg && <div className="max-w-[calc(100vw-32px)] animate-fadein rounded-full bg-ink px-[18px] py-2.5 text-center text-ui font-medium text-page shadow-toast">{msg}</div>}
    </div>
  );
}

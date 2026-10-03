'use client';
import { Button } from '@/components/ui/Button';

export default function StorefrontError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap flex flex-col items-start gap-3 py-16">
      <h1 className="h-page m-0">Something went wrong on our side</h1>
      <p className="m-0 text-body text-ink-2">Please try again. If it keeps happening, message us on WhatsApp and we’ll help.</p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </div>
  );
}

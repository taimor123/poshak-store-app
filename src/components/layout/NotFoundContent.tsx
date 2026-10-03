import { routes } from '@/config/routes';
import { ButtonLink } from '@/components/ui/Button';

export function NotFoundContent() {
  return (
    <div className="wrap flex flex-col items-start gap-3 py-16">
      <h1 className="h-page m-0">We couldn’t find that page</h1>
      <p className="m-0 text-body text-ink-2">The link may be old, or the piece may have sold out and been removed.</p>
      <ButtonLink href={routes.category('new')} className="mt-2">
        Shop new arrivals
      </ButtonLink>
    </div>
  );
}

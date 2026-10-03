import Link from 'next/link';

export function ClearFiltersButton({ href }: { href: string }) {
  return (
    <Link href={href} replace scroll={false} className="btn-primary">
      Clear all filters
    </Link>
  );
}

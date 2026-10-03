import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

const SIZES = {
  header: 'text-[26px]',
  drawer: 'text-[22px]',
  footer: 'text-[24px]',
} as const;

/**
 * The store's logo. Renders `siteConfig.logo.src` if set, otherwise the store
 * name as a Fraunces wordmark. Change either in src/config/site.ts.
 */
export function Logo({ size = 'header', href, className }: { size?: keyof typeof SIZES; href?: string; className?: string }) {
  const { name, logo } = siteConfig;
  const mark = logo.src ? (
    <Image src={logo.src} alt={name} width={logo.width} height={logo.height} priority={size === 'header'} className="h-8 w-auto" />
  ) : (
    <span className={cn('font-display leading-none font-semibold tracking-[0.02em]', SIZES[size])}>{name}</span>
  );

  if (!href) return <span className={className}>{mark}</span>;
  return (
    <Link href={href} aria-label={`${name} home`} className={cn('inline-flex items-center px-1.5 py-[9px] text-ink no-underline hover:text-ink', className)}>
      {mark}
    </Link>
  );
}

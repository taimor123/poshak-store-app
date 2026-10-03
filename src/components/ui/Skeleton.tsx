import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

/** Shimmer block. Size it to match the content it stands in for (zero layout shift). */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden="true" className={cn('sk', className)} style={style} />;
}

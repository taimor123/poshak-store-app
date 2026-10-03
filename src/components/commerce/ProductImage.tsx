import type { CSSProperties, ReactNode } from 'react';
import type { Swatch } from '@/lib/catalog/types';
import { swatchVar } from '@/lib/catalog/product';
import { cn } from '@/lib/cn';
import { KameezMotif } from '@/components/ui/icons';

/**
 * Product / hero imagery. Today: a flat fabric-tone placeholder with a kameez
 * motif. When real photos exist, render <Image fill sizes=… className="object-cover" />
 * from next/image inside the same box — the aspect ratios stay the same.
 */
export function ProductImage({
  swatch,
  alt,
  ratio = '3/4',
  motif = '38%',
  motifStyle,
  className,
  children,
}: {
  swatch: Swatch;
  alt: string;
  ratio?: '3/4' | '4/5';
  motif?: string;
  motifStyle?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-card', className)} style={{ aspectRatio: ratio }}>
      <div role="img" aria-label={alt} className="card-img absolute inset-0 flex items-center justify-center" style={{ background: swatchVar(swatch) }}>
        <KameezMotif style={{ width: motif, maxWidth: 170, ...motifStyle }} />
      </div>
      {children}
    </div>
  );
}

/** Small 3:4 colour thumbnail for cart lines and order summaries. */
export function LineThumb({ swatch, width = 52 }: { swatch: Swatch; width?: number }) {
  return <span aria-hidden="true" className="flex-none rounded-btn" style={{ width, aspectRatio: '3/4', background: swatchVar(swatch) }} />;
}

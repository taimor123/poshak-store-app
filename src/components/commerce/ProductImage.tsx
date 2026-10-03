import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import type { Swatch } from '@/lib/catalog/types';
import { swatchVar } from '@/lib/catalog/product';
import { cn } from '@/lib/cn';
import { KameezMotif } from '@/components/ui/icons';

/**
 * Product / hero imagery at a fixed aspect ratio. Renders the real photo when
 * the API has one; otherwise a flat fabric-tone placeholder with the kameez motif.
 */
export function ProductImage({
  image,
  swatch,
  alt,
  ratio = '3/4',
  motif = '38%',
  motifStyle,
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority,
  className,
  children,
}: {
  image?: { url: string; alt: string } | null;
  swatch: Swatch;
  alt: string;
  ratio?: '3/4' | '4/5';
  motif?: string;
  motifStyle?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-card', className)} style={{ aspectRatio: ratio, background: swatchVar(swatch) }}>
      {image ? (
        <Image src={image.url} alt={image.alt || alt} fill sizes={sizes} priority={priority} className="card-img object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="card-img absolute inset-0 flex items-center justify-center">
          <KameezMotif style={{ width: motif, maxWidth: 170, ...motifStyle }} />
        </div>
      )}
      {children}
    </div>
  );
}

/** Small 3:4 thumbnail for cart lines and order summaries. */
export function LineThumb({ swatch, image, width = 52 }: { swatch: Swatch; image?: { url: string } | null; width?: number }) {
  return (
    <span aria-hidden="true" className="relative flex-none overflow-hidden rounded-btn" style={{ width, aspectRatio: '3/4', background: swatchVar(swatch) }}>
      {image?.url && <Image src={image.url} alt="" fill sizes={`${width}px`} className="object-cover" />}
    </span>
  );
}

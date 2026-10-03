import { swatchFor } from '@/lib/catalog/product';
import type { ProductDetail } from '@/lib/catalog/types';
import { ProductImage } from '@/components/commerce/ProductImage';

// Placeholder views when a product has no photos yet.
const PLACEHOLDER_VIEWS: { label: string; transform: string }[] = [
  { label: 'Front', transform: 'none' },
  { label: 'Back', transform: 'scaleX(-1)' },
  { label: 'Detail', transform: 'scale(2.4) translateY(18%)' },
  { label: 'Fit', transform: 'scale(4)' },
];

const strip =
  'no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 md:-mx-6 md:scroll-px-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0 [&>*]:flex-[0_0_86%] [&>*]:snap-start md:[&>*]:flex-[0_0_60%] lg:[&>*]:flex-none';
const IMAGE_SIZES = '(min-width: 1024px) 30vw, (min-width: 768px) 60vw, 86vw';

/** Horizontal snap carousel on mobile, 2×2 grid ≥1024. */
export function ProductGallery({ product: p }: { product: ProductDetail }) {
  const swatch = swatchFor(p.colour);
  return (
    <div role="group" aria-label="Product images" className={strip}>
      {p.images.length
        ? p.images.map((img, i) => <ProductImage key={img.url} image={img} swatch={swatch} alt={img.alt} sizes={IMAGE_SIZES} priority={i === 0} />)
        : PLACEHOLDER_VIEWS.map((v) => (
            <ProductImage key={v.label} swatch={swatch} alt={`${v.label} view placeholder: kameez line drawing on ${(p.colour ?? 'fabric').toLowerCase()}`} motifStyle={{ maxWidth: 150, transform: v.transform }}>
              <span aria-hidden="true" className="absolute bottom-3 left-3 rounded-full bg-surface px-2.5 py-[5px] text-caption font-medium text-ink">
                {v.label}
              </span>
            </ProductImage>
          ))}
    </div>
  );
}

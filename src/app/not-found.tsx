import StorefrontLayout from './(storefront)/layout';
import { NotFoundContent } from '@/components/layout/NotFoundContent';

/** Unmatched URLs land here (outside the route group), so wrap in the storefront chrome. */
export default function NotFound() {
  return (
    <StorefrontLayout>
      <NotFoundContent />
    </StorefrontLayout>
  );
}

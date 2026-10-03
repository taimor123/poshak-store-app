import { getPublicConfig } from '@/lib/api/catalog';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const config = await getPublicConfig();
  return (
    <>
      <AnnouncementBar freeShippingThresholdPaisa={config.freeShippingThresholdPaisa} />
      <Header />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}

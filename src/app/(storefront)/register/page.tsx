import { RegisterView } from '@/components/account/AuthViews';

export const metadata = { title: 'Create an account', robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <RegisterView next={next} />;
}

import { SignInView } from '@/components/account/AuthViews';

export const metadata = { title: 'Sign in', robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <SignInView next={next} />;
}

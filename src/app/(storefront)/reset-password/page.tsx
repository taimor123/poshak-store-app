import { ResetPasswordView } from '@/components/account/AuthViews';

export const metadata = { title: 'Choose a new password', robots: { index: false } };

/** Linked from the reset email: /reset-password?token=… */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  return <ResetPasswordView token={token} />;
}

import { ForgotPasswordView } from '@/components/account/AuthViews';

export const metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type ReactNode } from 'react';
import { routes } from '@/config/routes';
import { forgotPassword, register, resetPassword, signIn } from '@/lib/actions/auth';
import type { ApiError } from '@/lib/api/envelope';
import { refreshCart } from '@/stores/cart';
import { useShopper } from '@/stores/shopper';
import { toast } from '@/stores/ui';
import { TextField } from '@/components/ui/Field';

// Email + password accounts (owner decision 2026-10-03). Email OTP comes later.

const safeNext = (next?: string) => (next && next.startsWith('/') && !next.startsWith('//') ? next : routes.account());

function AuthCard({ title, intro, children, footer }: { title: string; intro?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="wrap pt-10">
      <div className="card-box mx-auto flex max-w-[420px] flex-col gap-5 px-6 py-7">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-title font-semibold">{title}</h1>
          {intro && <p className="m-0 text-body text-ink-2">{intro}</p>}
        </div>
        {children}
      </div>
      {footer && <p className="mx-auto mt-5 max-w-[420px] text-center text-ui text-ink-2">{footer}</p>}
    </div>
  );
}

function FormError({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="m-0 text-ui font-medium text-sale">
      {error}
    </p>
  ) : null;
}

/** After sign-in/registration: session into the store, merged cart, then go on. */
function useSignedIn(next?: string) {
  const router = useRouter();
  const setUser = useShopper((s) => s.setUser);
  return async (user: Parameters<typeof setUser>[0]) => {
    setUser(user);
    await refreshCart();
    router.push(safeNext(next));
    router.refresh();
  };
}

const fieldErr = (e: ApiError | null, k: string) => e?.fieldErrors?.[k];

export function SignInView({ next }: { next?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, start] = useTransition();
  const done = useSignedIn(next);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await signIn(email.trim(), password);
      if (!r.ok) return setError(r.error);
      toast(`Welcome back, ${r.data.user.name.split(' ')[0]}`);
      await done(r.data.user);
    });
  };

  return (
    <AuthCard
      title="Sign in"
      intro="Track orders, save addresses and check out faster."
      footer={
        <>
          Just want to check an order?{' '}
          <Link href={routes.account('track')} className="font-semibold">
            Track without signing in
          </Link>
        </>
      }
    >
      <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
        <TextField id="si-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErr(error, 'email')} />
        <TextField id="si-password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErr(error, 'password')} />
        <FormError error={error && !error.fieldErrors ? error.message : ''} />
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={routes.forgotPassword} className="tlink text-ui">
            Forgot password?
          </Link>
          <Link href={routes.register(next)} className="tlink text-ui">
            Create an account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

export function RegisterView({ next }: { next?: string }) {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, start] = useTransition();
  const done = useSignedIn(next);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await register({ name: f.name.trim(), email: f.email.trim(), password: f.password });
      if (!r.ok) return setError(r.error);
      toast('Your account is ready. Shukriya!');
      await done(r.data.user);
    });
  };

  return (
    <AuthCard
      title="Create an account"
      intro="See your orders and tracking in one place."
      footer={
        <>
          Already have an account?{' '}
          <Link href={routes.signIn(next)} className="font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
        <TextField id="rg-name" label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={fieldErr(error, 'name')} />
        <TextField id="rg-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={fieldErr(error, 'email')} />
        <TextField
          id="rg-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={f.password}
          onChange={set('password')}
          error={fieldErr(error, 'password')}
          hint="At least 8 characters. A short phrase is easier to remember."
        />
        <FormError error={error && !error.fieldErrors ? error.message : ''} />
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Creating your account…' : 'Create account'}
        </button>
        <p className="m-0 text-caption text-ink-2">We’ll email order updates. We never share your details.</p>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await forgotPassword(email.trim());
      if (!r.ok) return setError(r.error);
      setError(null);
      setMessage(r.data.message);
    });
  };

  return (
    <AuthCard title="Reset your password" intro="Enter your email and we’ll send you a link to set a new password.">
      {message ? (
        <p role="status" className="m-0 text-body text-ink">
          {message}
        </p>
      ) : (
        <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
          <TextField id="fp-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErr(error, 'email')} />
          <FormError error={error && !error.fieldErrors ? error.message : ''} />
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <Link href={routes.signIn()} className="tlink self-start text-ui">
        ← Back to sign in
      </Link>
    </AuthCard>
  );
}

export function ResetPasswordView({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await resetPassword(token, password);
      if (!r.ok) return setError(r.error);
      toast(r.data.message);
      router.push(routes.signIn());
    });
  };

  return (
    <AuthCard title="Choose a new password">
      <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
        <TextField id="rp-password" label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErr(error, 'password')} />
        <FormError error={error ? (fieldErr(error, 'token') ?? (error.fieldErrors ? '' : error.message)) : ''} />
        <button type="submit" className="btn-primary" disabled={pending || !token}>
          {pending ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </AuthCard>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [hasAdminConfigured, setHasAdminConfigured] = useState<boolean | null>(null);

  // Check if admin is provisioned
  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/auth/setup');
        if (res.ok) {
          const data = await res.json();
          setHasAdminConfigured(data.hasAdmin);
        }
      } catch {
        // ignore
      }
    }
    checkSetup();
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    if (lockoutSeconds && lockoutSeconds > 0) {
      setError(`Account temporarily locked. Please wait ${lockoutSeconds} seconds.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setLockoutSeconds(data.retryAfterSeconds || 60);
          setError(data.message || 'Too many failed login attempts.');
        } else {
          setError(data.message || 'Invalid username or password.');
        }
        setIsLoading(false);
        return;
      }

      // Success: redirect to admin dashboard (or settings if must change password)
      if (data.mustChangePassword) {
        router.push('/admin/settings');
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-6 sm:p-8 shadow-sm">
      {/* Brand & Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#171717] text-white dark:bg-[#ededed] dark:text-black mb-3">
          <Shield className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
          Admin Authentication
        </h1>
        <p className="text-xs text-[#666666] dark:text-[#a1a1a1] mt-1">
          Sign in with your administrator credentials
        </p>
      </div>

      {/* First-time setup alert */}
      {hasAdminConfigured === false && (
        <div className="mb-5 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
          <p className="font-medium mb-1">No admin account found</p>
          <p className="mb-2">
            This appears to be your first time running Tool Collection.
          </p>
          <Link
            href="/admin/setup"
            className="inline-flex items-center gap-1 font-medium underline underline-offset-2"
          >
            Go to Admin Setup Initialization →
          </Link>
        </div>
      )}

      {/* Error / Lockout Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span>{error}</span>
            {lockoutSeconds && lockoutSeconds > 0 && (
              <div className="mt-1 font-mono font-bold">
                Retry available in: {lockoutSeconds}s
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-username-input"
            className="block text-xs font-medium text-[#171717] dark:text-[#ededed] mb-1.5"
          >
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] dark:text-[#a1a1a1]" />
            <input
              id="admin-username-input"
              type="text"
              autoComplete="username"
              required
              disabled={isLoading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-password-input"
            className="block text-xs font-medium text-[#171717] dark:text-[#ededed] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] dark:text-[#a1a1a1]" />
            <input
              id="admin-password-input"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <button
          id="admin-login-submit-btn"
          type="submit"
          disabled={isLoading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : lockoutSeconds && lockoutSeconds > 0 ? (
            <span>Locked ({lockoutSeconds}s)</span>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-[#eaeaea] dark:border-[#27272a] text-center text-[11px] text-[#666666] dark:text-[#a1a1a1]">
        <span>Protected by Supabase Auth with server-side brute-force throttling.</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#ededed] p-4 sm:p-6">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Public Site
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card with Suspense */}
      <div className="max-w-md w-full mx-auto my-auto">
        <Suspense
          fallback={
            <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-[#666666] dark:text-[#a1a1a1] max-w-md w-full mx-auto">
        <span>Tool Collection • Developer Console</span>
      </div>
    </div>
  );
}

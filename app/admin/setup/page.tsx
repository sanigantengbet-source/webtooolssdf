'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Database, CheckCircle2, AlertTriangle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AdminSetupPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ChangeMe_123!@#');
  const [isCustomPassword, setIsCustomPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/auth/setup');
        const data = await res.json();
        setIsConfigured(Boolean(data.configured));
        setHasAdmin(Boolean(data.hasAdmin));
      } catch (err) {
        console.error('Failed to check setup status:', err);
      } finally {
        setIsChecking(false);
      }
    }
    checkStatus();
  }, []);

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: isCustomPassword ? password : 'ChangeMe_123!@#',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Initialization failed.');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('A network error occurred while initializing the admin.');
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#ededed]">
        <div className="flex items-center gap-2 text-xs">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking database initialization state...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#ededed] p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-lg w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Public Site
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="max-w-lg w-full mx-auto my-auto">
        <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#171717] text-white dark:bg-[#ededed] dark:text-black mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
              First-Time Admin Setup
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#a1a1a1] mt-1">
              Initialize your administrator account with Supabase Auth
            </p>
          </div>

          {/* If not configured */}
          {!isConfigured && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <Database className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div className="space-y-1">
                    <p className="font-semibold">Supabase Credentials Missing</p>
                    <p>
                      Please define the required environment variables in your{' '}
                      <code className="px-1 py-0.5 bg-amber-500/20 rounded font-mono">
                        .env.local
                      </code>{' '}
                      or Vercel dashboard:
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-[#fafafa] dark:bg-[#161616] border border-[#eaeaea] dark:border-[#27272a] font-mono text-[11px] text-[#171717] dark:text-[#ededed] space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
                <div>SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here</div>
              </div>

              <div className="text-xs text-[#666666] dark:text-[#a1a1a1] space-y-1">
                <p>
                  1. Run <code className="font-mono text-black dark:text-white">supabase/schema.sql</code> in your Supabase SQL Editor.
                </p>
                <p>2. Set the environment variables above and reload this page.</p>
              </div>
            </div>
          )}

          {/* If already has admin */}
          {isConfigured && hasAdmin && !success && (
            <div className="text-center py-4 space-y-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-1">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Admin Account Already Initialized</h2>
              <p className="text-xs text-[#666666] dark:text-[#a1a1a1]">
                An administrator account is already provisioned. First-time setup is now locked to preserve security.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90"
                >
                  Proceed to Login
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Setup Form */}
          {isConfigured && !hasAdmin && !success && (
            <form onSubmit={handleInitialize} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="p-3 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-[#666666] dark:text-[#a1a1a1] space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-[#171717] dark:text-[#ededed]">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Default Provisioning Policy</span>
                </div>
                <p>
                  Default credentials: Username <strong className="font-mono text-black dark:text-white">admin</strong>, Password <strong className="font-mono text-black dark:text-white">ChangeMe_123!@#</strong>.
                </p>
                <p>
                  Upon first login, the application will mandate changing the default password before performing any administrative actions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] dark:text-[#ededed] mb-1">
                  Administrator Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="custom-password-check"
                  checked={isCustomPassword}
                  onChange={(e) => setIsCustomPassword(e.target.checked)}
                  className="rounded border-zinc-300 text-black focus:ring-black"
                />
                <label
                  htmlFor="custom-password-check"
                  className="text-xs text-[#666666] dark:text-[#a1a1a1] cursor-pointer"
                >
                  Set custom initial password now instead of default
                </label>
              </div>

              {isCustomPassword && (
                <div>
                  <label className="block text-xs font-medium text-[#171717] dark:text-[#ededed] mb-1">
                    Custom Password (min 12 chars, upper, lower, digit, symbol)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Provisioning Admin...</span>
                  </>
                ) : (
                  <span>Create Admin Account</span>
                )}
              </button>
            </form>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center py-4 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-1">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-base font-semibold">Admin Account Initialized!</h2>
              <p className="text-xs text-[#666666] dark:text-[#a1a1a1] leading-relaxed">
                Your administrator user was created in Supabase Auth with username{' '}
                <strong className="font-mono text-[#171717] dark:text-[#ededed]">
                  {username}
                </strong>
                . Setup is now permanently closed.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push('/admin/login')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90"
                >
                  Proceed to Login
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-[#666666] dark:text-[#a1a1a1] max-w-lg w-full mx-auto">
        <span>Tool Collection • First-Time Initialization</span>
      </div>
    </div>
  );
}

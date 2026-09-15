'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, AlertCircle, ArrowRight, X } from 'lucide-react';

interface SupabaseBannerProps {
  isConfigured: boolean;
}

export function SupabaseBanner({ isConfigured }: SupabaseBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (isConfigured || dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Database className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Supabase Setup:</strong> Connect your Supabase project in{' '}
            <code className="px-1 py-0.5 rounded bg-amber-500/20 font-mono text-[11px]">
              .env.local
            </code>{' '}
            and run{' '}
            <code className="px-1 py-0.5 rounded bg-amber-500/20 font-mono text-[11px]">
              supabase/schema.sql
            </code>{' '}
            to enable live database & real-time sync.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/setup"
            className="inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:opacity-80"
          >
            Setup Guide
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded hover:bg-amber-500/20 text-amber-700 dark:text-amber-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

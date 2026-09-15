import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#ededed] p-4">
      <div className="max-w-md w-full text-center p-8 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111]">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold mb-2">403 - Access Denied</h1>
        <p className="text-xs text-[#666666] dark:text-[#a1a1a1] mb-6 leading-relaxed">
          You do not have administrator permissions to access this console. This security event has been logged.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Public Collection
        </Link>
      </div>
    </div>
  );
}

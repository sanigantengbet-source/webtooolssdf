import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-[#171717] dark:text-[#ededed] p-4">
      <div className="max-w-md w-full text-center p-8 rounded-lg border border-[#eaeaea] dark:border-[#27272a]">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mb-4">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold mb-2">404 - Page Not Found</h1>
        <p className="text-xs text-[#666666] dark:text-[#a1a1a1] mb-6 leading-relaxed">
          The tool or resource you are seeking could not be found or may have been archived.
        </p>
        <Link
          href="/tools"
          id="not-found-back-link"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Tools Collection
        </Link>
      </div>
    </div>
  );
}
